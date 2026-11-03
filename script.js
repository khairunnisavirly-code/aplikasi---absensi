
let daftarAbsensi = JSON.parse(
    localStorage.getItem("dataAbsensi")
) || [];

let indexEdit = null;

function simpanData() {
    localStorage.setItem(
        "dataAbsensi",
        JSON.stringify(daftarAbsensi)
    );
}

function tambahAbsensi() {
    let nama = document.getElementById("nama").value.trim();
    let kelas = document.getElementById("kelas").value.trim();
    let status = document.getElementById("status").value;

    if (nama === "" || kelas === "") {
        alert("Nama dan kelas harus diisi!");
        return;
    }

    if (indexEdit !== null) {
        daftarAbsensi[indexEdit].nama = nama;
        daftarAbsensi[indexEdit].kelas = kelas;
        daftarAbsensi[indexEdit].status = status;

        batalEdit();
    } else {
        let sekarang = new Date();

        let tanggal = sekarang.toLocaleDateString("id-ID");
        let waktu = sekarang.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        daftarAbsensi.push({
            nama: nama,
            kelas: kelas,
            status: status,
            tanggal: tanggal,
            waktu: waktu
        });
    }

    simpanData();
    tampilkanAbsensi();

    document.getElementById("nama").value = "";
    document.getElementById("kelas").value = "";
}

function editAbsensi(index) {
    let data = daftarAbsensi[index];

    document.getElementById("nama").value = data.nama;
    document.getElementById("kelas").value = data.kelas;
    document.getElementById("status").value = data.status;

    indexEdit = index;

    document.getElementById("judulForm").textContent = "Edit Absensi";
    document.getElementById("tombolSimpan").textContent = "Simpan Perubahan";
    document.getElementById("tombolBatal").style.display = "block";

    document.querySelector(".container").scrollIntoView({
        behavior: "smooth"
    });
}

function batalEdit() {
    indexEdit = null;

    document.getElementById("nama").value = "";
    document.getElementById("kelas").value = "";
    document.getElementById("status").value = "Hadir";

    document.getElementById("judulForm").textContent = "Form Absensi";
    document.getElementById("tombolSimpan").textContent = "Simpan Absensi";
    document.getElementById("tombolBatal").style.display = "none";
}

function hapusAbsensi(index) {
    if (confirm("Yakin ingin menghapus data ini?")) {
        daftarAbsensi.splice(index, 1);
        simpanData();
        tampilkanAbsensi();

        if (indexEdit !== null) {
            batalEdit();
        }
    }
}

function cariAbsensi() {
    tampilkanAbsensi();
}

function tampilkanAbsensi() {
    let tabel = document.getElementById("dataAbsensi");
    let kataKunci = document.getElementById("pencarian").value
        .toLowerCase()
        .trim();

    tabel.innerHTML = "";

    let dataFilter = daftarAbsensi
        .map((data, index) => ({ data, index }))
        .filter(item =>
            item.data.nama.toLowerCase().includes(kataKunci) ||
            item.data.kelas.toLowerCase().includes(kataKunci)
        );

    dataFilter.forEach(item => {
        let data = item.data;
        let index = item.index;

        let baris = tabel.insertRow();

        baris.insertCell(0).textContent = data.nama;
        baris.insertCell(1).textContent = data.kelas;
        baris.insertCell(2).textContent = data.status;
        baris.insertCell(3).textContent = data.tanggal || "-";
        baris.insertCell(4).textContent = data.waktu || "-";

        let aksi = baris.insertCell(5);

        let tombolEdit = document.createElement("button");
        tombolEdit.textContent = "Edit";
        tombolEdit.className = "tombol-edit";
        tombolEdit.onclick = function() {
            editAbsensi(index);
        };

        let tombolHapus = document.createElement("button");
        tombolHapus.textContent = "Hapus";
        tombolHapus.className = "tombol-hapus";
        tombolHapus.onclick = function() {
            hapusAbsensi(index);
        };

        aksi.appendChild(tombolEdit);
        aksi.appendChild(tombolHapus);
    });

    document.getElementById("pesanKosong").textContent =
        dataFilter.length === 0
            ? "Data siswa tidak ditemukan."
            : "";

    // Dashboard tetap menghitung seluruh data, bukan hasil pencarian
    document.getElementById("total").textContent =
        daftarAbsensi.length;

    document.getElementById("hadir").textContent =
        daftarAbsensi.filter(d => d.status === "Hadir").length;

    document.getElementById("izin").textContent =
        daftarAbsensi.filter(d => d.status === "Izin").length;

    document.getElementById("sakit").textContent =
        daftarAbsensi.filter(d => d.status === "Sakit").length;

    document.getElementById("alfa").textContent =
        daftarAbsensi.filter(d => d.status === "Alfa").length;
}

tampilkanAbsensi();
