
var warga =
    JSON.parse(localStorage.getItem("dataWarga")) || [];

var iuran =
    JSON.parse(localStorage.getItem("dataIuran")) || [];

var pengeluaran =
    JSON.parse(localStorage.getItem("dataPengeluaran")) || [];


var NOMINAL_IURAN = 20000;


var bulanList = [
    "",
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember"
];



/* ================= NAVIGASI ================= */

function tampilkan(halaman) {

    document.querySelectorAll(".halaman").forEach(
        function(x) {
            x.style.display = "none";
        }
    );


    document.getElementById(halaman).style.display =
        "block";


    if (halaman == "dashboard") {
        updateDashboard();
    }


    if (halaman == "warga") {
        tampilkanWarga();
    }


    if (halaman == "iuran") {
        isiPilihanWarga();
        tampilkanIuran();
    }


    if (halaman == "rekap") {
        tampilkanRekap();
    }


    if (halaman == "pengeluaran") {
        tampilkanPengeluaran();
    }


    if (halaman == "bukukas") {
        tampilkanBukuKas();
    }
}



/* ================= DASHBOARD ================= */

function updateDashboard() {

    document.getElementById("jumlahKK").innerHTML =
        warga.length;


    var sekarang = new Date();

    var bulanSekarang =
        sekarang.getMonth() + 1;

    var tahunSekarang =
        sekarang.getFullYear();


    var sudah = 0;


    for (
        var i = 0;
        i < warga.length;
        i++
    ) {

        var ditemukan = false;


        for (
            var j = 0;
            j < iuran.length;
            j++
        ) {

            if (
                iuran[j].wargaId ==
                warga[i].id &&

                iuran[j].bulan ==
                bulanSekarang &&

                iuran[j].tahun ==
                tahunSekarang
            ) {

                ditemukan = true;

                break;
            }
        }


        if (ditemukan) {
            sudah++;
        }
    }


    document.getElementById(
        "sudahBayar"
    ).innerHTML =
        sudah;


    document.getElementById(
        "belumBayar"
    ).innerHTML =
        warga.length - sudah;


    var totalPemasukan = 0;


    for (
        var a = 0;
        a < iuran.length;
        a++
    ) {

        totalPemasukan +=
            Number(
                iuran[a].nominal
            );
    }


    var totalPengeluaran = 0;


    for (
        var b = 0;
        b < pengeluaran.length;
        b++
    ) {

        totalPengeluaran +=
            Number(
                pengeluaran[b].nominal
            );
    }


    var saldo =
        totalPemasukan -
        totalPengeluaran;


    document.getElementById(
        "totalPemasukan"
    ).innerHTML =
        rupiah(
            totalPemasukan
        );


    document.getElementById(
        "totalPengeluaran"
    ).innerHTML =
        rupiah(
            totalPengeluaran
        );


    document.getElementById(
        "saldoKas"
    ).innerHTML =
        rupiah(
            saldo
        );
}



/* ================= DATA WARGA ================= */

function simpanWarga(event) {

    event.preventDefault();


    var nama =
        document.getElementById(
            "namaWarga"
        ).value;


    var alamat =
        document.getElementById(
            "alamatWarga"
        ).value;


    var hp =
        document.getElementById(
            "hpWarga"
        ).value;


    if (nama == "") {

        alert(
            "Nama kepala keluarga wajib diisi"
        );

        return;
    }


    warga.push({

        id: Date.now(),

        nama: nama,

        alamat: alamat,

        hp: hp

    });


    localStorage.setItem(
        "dataWarga",
        JSON.stringify(warga)
    );


    document.getElementById(
        "namaWarga"
    ).value = "";


    document.getElementById(
        "alamatWarga"
    ).value = "";


    document.getElementById(
        "hpWarga"
    ).value = "";


    tampilkanWarga();

    updateDashboard();


    alert(
        "Data warga berhasil disimpan"
    );
}



function tampilkanWarga() {

    var tabel =
        document.getElementById(
            "tabelWarga"
        );


    if (!tabel) {
        return;
    }


    tabel.innerHTML = "";


    for (
        var i = 0;
        i < warga.length;
        i++
    ) {

        var baris =
            tabel.insertRow();


        baris.insertCell(0).innerHTML =
            i + 1;


        baris.insertCell(1).innerHTML =
            warga[i].nama;


        baris.insertCell(2).innerHTML =
            warga[i].alamat || "-";


        baris.insertCell(3).innerHTML =
            warga[i].hp || "-";


        baris.insertCell(4).innerHTML =
            '<button onclick="hapusWarga(' +
            warga[i].id +
            ')">Hapus</button>';
    }
}



function hapusWarga(id) {

    if (
        !confirm(
            "Hapus data warga ini?"
        )
    ) {
        return;
    }


    for (
        var i = 0;
        i < warga.length;
        i++
    ) {

        if (
            warga[i].id == id
        ) {

            warga.splice(i, 1);

            break;
        }
    }


    localStorage.setItem(
        "dataWarga",
        JSON.stringify(warga)
    );


    tampilkanWarga();

    updateDashboard();
}



/* ================= INPUT IURAN ================= */

function isiPilihanWarga() {

    var select =
        document.getElementById(
            "wargaIuran"
        );


    if (!select) {
        return;
    }


    select.innerHTML =
        '<option value="">-- Pilih Warga --</option>';


    for (
        var i = 0;
        i < warga.length;
        i++
    ) {

        select.innerHTML +=
            '<option value="' +
            warga[i].id +
            '">' +
            warga[i].nama +
            '</option>';
    }
}



function simpanIuran(event) {

    event.preventDefault();


    var wargaId =
        document.getElementById(
            "wargaIuran"
        ).value;


    var bulan =
        document.getElementById(
            "bulanIuran"
        ).value;


    var tahun =
        document.getElementById(
            "tahunIuran"
        ).value;


    var tanggal =
        document.getElementById(
            "tanggalIuran"
        ).value;


    if (
        wargaId == "" ||
        bulan == "" ||
        tahun == "" ||
        tanggal == ""
    ) {

        alert(
            "Lengkapi data pembayaran"
        );

        return;
    }


    for (
        var i = 0;
        i < iuran.length;
        i++
    ) {

        if (
            iuran[i].wargaId ==
            wargaId &&

            iuran[i].bulan ==
            bulan &&

            iuran[i].tahun ==
            tahun
        ) {

            alert(
                "Iuran bulan tersebut sudah tercatat."
            );

            return;
        }
    }


    iuran.push({

        id: Date.now(),

        wargaId: wargaId,

        bulan: Number(bulan),

        tahun: Number(tahun),

        nominal:
            NOMINAL_IURAN,

        tanggal: tanggal

    });


    localStorage.setItem(
        "dataIuran",
        JSON.stringify(iuran)
    );


    tampilkanIuran();

    updateDashboard();


    document.getElementById(
        "wargaIuran"
    ).value = "";


    document.getElementById(
        "bulanIuran"
    ).value = "";


    document.getElementById(
        "tanggalIuran"
    ).value = "";


    alert(
        "Iuran berhasil disimpan"
    );
}



function tampilkanIuran() {

    var tabel =
        document.getElementById(
            "tabelIuran"
        );


    if (!tabel) {
        return;
    }


    tabel.innerHTML = "";


    for (
        var i = 0;
        i < iuran.length;
        i++
    ) {

        var data =
            iuran[i];


        var nama = "-";


        for (
            var j = 0;
            j < warga.length;
            j++
        ) {

            if (
                warga[j].id ==
                data.wargaId
            ) {

                nama =
                    warga[j].nama;

                break;
            }
        }


        var baris =
            tabel.insertRow();


        baris.insertCell(0).innerHTML =
            i + 1;


        baris.insertCell(1).innerHTML =
            nama;


        baris.insertCell(2).innerHTML =
            bulanList[
                data.bulan
            ];


        baris.insertCell(3).innerHTML =
            data.tahun;


        baris.insertCell(4).innerHTML =
            rupiah(
                data.nominal
            );


        baris.insertCell(5).innerHTML =
            data.tanggal;


        baris.insertCell(6).innerHTML =
            '<button onclick="hapusIuran(' +
            data.id +
            ')">Hapus</button>';
    }
}



function hapusIuran(id) {

    if (
        !confirm(
            "Hapus pembayaran ini?"
        )
    ) {
        return;
    }


    for (
        var i = 0;
        i < iuran.length;
        i++
    ) {

        if (
            iuran[i].id == id
        ) {

            iuran.splice(i, 1);

            break;
        }
    }


    localStorage.setItem(
        "dataIuran",
        JSON.stringify(iuran)
    );


    tampilkanIuran();

    updateDashboard();
}



/* ================= REKAP ================= */

function tampilkanRekap() {

    var tahunElement =
        document.getElementById(
            "tahunRekap"
        );


    if (!tahunElement) {
        return;
    }


    var tahun =
        Number(
            tahunElement.value
        );


    var tabel =
        document.getElementById(
            "tabelRekap"
        );


    if (!tabel) {
        return;
    }


    tabel.innerHTML = "";


    var totalTagihan =
        warga.length *
        12 *
        NOMINAL_IURAN;


    var totalTerbayar = 0;


    for (
        var i = 0;
        i < iuran.length;
        i++
    ) {

        if (
            Number(
                iuran[i].tahun
            ) == tahun
        ) {

            totalTerbayar +=
                Number(
                    iuran[i].nominal
                );
        }
    }


    var totalBelumBayar =
        totalTagihan -
        totalTerbayar;


    document.getElementById(
        "totalTagihan"
    ).innerHTML =
        rupiah(
            totalTagihan
        );


    document.getElementById(
        "totalTerbayar"
    ).innerHTML =
        rupiah(
            totalTerbayar
        );


    document.getElementById(
        "totalBelumBayar"
    ).innerHTML =
        rupiah(
            totalBelumBayar
        );



    for (
        var w = 0;
        w < warga.length;
        w++
    ) {

        var jumlahBayar = 0;

        var jumlahBelumBayar = 0;


        var baris =
            tabel.insertRow();


        baris.insertCell(0).innerHTML =
            w + 1;


        baris.insertCell(1).innerHTML =
            warga[w].nama;



        for (
            var bulan = 1;
            bulan <= 12;
            bulan++
        ) {

            var bayar = false;


            for (
                var p = 0;
                p < iuran.length;
                p++
            ) {

                if (

                    String(
                        iuran[p].wargaId
                    ) ==

                    String(
                        warga[w].id
                    )

                    &&

                    Number(
                        iuran[p].bulan
                    ) == bulan

                    &&

                    Number(
                        iuran[p].tahun
                    ) == tahun

                ) {

                    bayar = true;

                    break;
                }
            }


            if (bayar) {

                jumlahBayar++;


                baris.insertCell(
                    bulan + 1
                ).innerHTML =
                    "✓";

            } else {

                jumlahBelumBayar++;


                baris.insertCell(
                    bulan + 1
                ).innerHTML =
                    "-";
            }
        }


        baris.insertCell(
            14
        ).innerHTML =
            rupiah(
                jumlahBayar *
                NOMINAL_IURAN
            );


        baris.insertCell(
            15
        ).innerHTML =
            rupiah(
                jumlahBelumBayar *
                NOMINAL_IURAN
            );
    }
}



/* ================= PENGELUARAN ================= */

function simpanPengeluaran(event) {

    event.preventDefault();


    var tanggal =
        document.getElementById(
            "tanggalPengeluaran"
        ).value;


    var keperluan =
        document.getElementById(
            "keperluanPengeluaran"
        ).value;


    var kategori =
        document.getElementById(
            "kategoriPengeluaran"
        ).value;


    var nominal =
        document.getElementById(
            "nominalPengeluaran"
        ).value;


    var keterangan =
        document.getElementById(
            "keteranganPengeluaran"
        ).value;


    if (
        tanggal == "" ||
        keperluan == "" ||
        nominal == ""
    ) {

        alert(
            "Lengkapi data pengeluaran"
        );

        return;
    }


    pengeluaran.push({

        id: Date.now(),

        tanggal: tanggal,

        keperluan:
            keperluan,

        kategori:
            kategori,

        nominal:
            Number(nominal),

        keterangan:
            keterangan

    });


    localStorage.setItem(
        "dataPengeluaran",
        JSON.stringify(
            pengeluaran
        )
    );


    tampilkanPengeluaran();

    updateDashboard();


    document.getElementById(
        "tanggalPengeluaran"
    ).value = "";


    document.getElementById(
        "keperluanPengeluaran"
    ).value = "";


    document.getElementById(
        "nominalPengeluaran"
    ).value = "";


    document.getElementById(
        "keteranganPengeluaran"
    ).value = "";


    alert(
        "Pengeluaran berhasil disimpan"
    );
}



function tampilkanPengeluaran() {

    var tabel =
        document.getElementById(
            "tabelPengeluaran"
        );


    if (!tabel) {
        return;
    }


    tabel.innerHTML = "";


    for (
        var i = 0;
        i < pengeluaran.length;
        i++
    ) {

        var data =
            pengeluaran[i];


        var baris =
            tabel.insertRow();


        baris.insertCell(0).innerHTML =
            i + 1;


        baris.insertCell(1).innerHTML =
            data.tanggal;


        baris.insertCell(2).innerHTML =
            data.keperluan;


        baris.insertCell(3).innerHTML =
            data.kategori;


        baris.insertCell(4).innerHTML =
            rupiah(
                data.nominal
            );


        baris.insertCell(5).innerHTML =
            data.keterangan || "-";


        baris.insertCell(6).innerHTML =
            '<button onclick="hapusPengeluaran(' +
            data.id +
            ')">Hapus</button>';
    }
}



function hapusPengeluaran(id) {

    if (
        !confirm(
            "Hapus pengeluaran ini?"
        )
    ) {
        return;
    }


    for (
        var i = 0;
        i < pengeluaran.length;
        i++
    ) {

        if (
            pengeluaran[i].id == id
        ) {

            pengeluaran.splice(i, 1);

            break;
        }
    }


    localStorage.setItem(
        "dataPengeluaran",
        JSON.stringify(
            pengeluaran
        )
    );


    tampilkanPengeluaran();

    updateDashboard();
}



/* ================= BUKU KAS ================= */

function tampilkanBukuKas() {

    var tahunElement =
        document.getElementById(
            "tahunBukuKas"
        );


    if (!tahunElement) {
        return;
    }


    var tahun =
        Number(
            tahunElement.value
        );


    var tabel =
        document.getElementById(
            "tabelBukuKas"
        );


    if (!tabel) {
        return;
    }


    tabel.innerHTML = "";


    var transaksi = [];



    /* ================= PEMASUKAN ================= */

    for (
        var i = 0;
        i < iuran.length;
        i++
    ) {

        if (
            Number(
                iuran[i].tahun
            ) == tahun
        ) {

            var nama = "-";


            for (
                var w = 0;
                w < warga.length;
                w++
            ) {

                if (
                    String(
                        warga[w].id
                    ) ==

                    String(
                        iuran[i].wargaId
                    )
                ) {

                    nama =
                        warga[w].nama;

                    break;
                }
            }


            transaksi.push({

                tanggal:
                    iuran[i].tanggal,

                uraian:
                    "Iuran " +
                    nama +
                    " - " +
                    bulanList[
                        iuran[i].bulan
                    ],

                pemasukan:
                    Number(
                        iuran[i].nominal
                    ),

                pengeluaran: 0

            });
        }
    }



    /* ================= PENGELUARAN ================= */

    for (
        var p = 0;
        p < pengeluaran.length;
        p++
    ) {

        var tanggal =
            pengeluaran[p].tanggal;


        if (
            tanggal &&

            Number(
                tanggal.substring(
                    0,
                    4
                )
            ) == tahun
        ) {

            transaksi.push({

                tanggal:
                    tanggal,

                uraian:
                    pengeluaran[p]
                        .keperluan,

                pemasukan: 0,

                pengeluaran:
                    Number(
                        pengeluaran[p]
                            .nominal
                    )

            });
        }
    }



    /* ================= URUTKAN TANGGAL ================= */

    transaksi.sort(
        function(a, b) {

            return a.tanggal.localeCompare(
                b.tanggal
            );

        }
    );



    var saldo = 0;

    var totalPemasukan = 0;

    var totalPengeluaran = 0;



    /* ================= TABEL ================= */

    for (
        var t = 0;
        t < transaksi.length;
        t++
    ) {

        var data =
            transaksi[t];


        totalPemasukan +=
            data.pemasukan;


        totalPengeluaran +=
            data.pengeluaran;


        saldo +=
            data.pemasukan -
            data.pengeluaran;


        var baris =
            tabel.insertRow();


        baris.insertCell(0).innerHTML =
            t + 1;


        baris.insertCell(1).innerHTML =
            data.tanggal;


        baris.insertCell(2).innerHTML =
            data.uraian;


        baris.insertCell(3).innerHTML =
            data.pemasukan > 0
                ? rupiah(
                    data.pemasukan
                )
                : "-";


        baris.insertCell(4).innerHTML =
            data.pengeluaran > 0
                ? rupiah(
                    data.pengeluaran
                )
                : "-";


        baris.insertCell(5).innerHTML =
            rupiah(
                saldo
            );
    }



    /* ================= RINGKASAN ================= */

    document.getElementById(
        "kasPemasukan"
    ).innerHTML =
        rupiah(
            totalPemasukan
        );


    document.getElementById(
        "kasPengeluaran"
    ).innerHTML =
        rupiah(
            totalPengeluaran
        );


    document.getElementById(
        "kasSaldo"
    ).innerHTML =
        rupiah(
            totalPemasukan -
            totalPengeluaran
        );
}



/* ================= FORMAT RUPIAH ================= */

function rupiah(angka) {

    return "Rp" +
        Number(
            angka
        ).toLocaleString(
            "id-ID"
        );
}



/* ================= MULAI APLIKASI ================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        tampilkan(
            "dashboard"
        );


        updateDashboard();

    }
);
