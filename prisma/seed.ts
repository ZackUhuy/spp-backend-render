import { PrismaClient, Role, CategoryType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Memulai Proses Seeding Database ===');

  // 1. Hashing Password Default untuk Akun Demo
  const saltRounds = 10;
  const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, saltRounds);
  };

  const defaultPasswordAdmin = await hashPassword('admin123');
  const defaultPasswordParent = await hashPassword('parent123');

  // 2. Seed Data Master: School Units (Unit Sekolah)
  console.log('Seeding data unit sekolah...');
  const unitKB = await prisma.schoolUnit.upsert({
    where: { id: 1 },
    update: { name: 'KB' },
    create: {
      id: 1,
      name: 'KB',
    },
  });

  const unitRA = await prisma.schoolUnit.upsert({
    where: { id: 2 },
    update: { name: 'RA' },
    create: {
      id: 2,
      name: 'RA',
    },
  });

  const unitSD = await prisma.schoolUnit.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'SD',
    },
  });

  const unitTPA = await prisma.schoolUnit.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      name: 'TPA',
    },
  });

  console.log('Unit sekolah berhasil disiapkan.');

  // 3. Seed Data Master: Users (Pengguna Pengujian)
  console.log('Seeding data pengguna default...');

  // Akun Super Admin (Bisa mengelola semua unit - schoolUnitId NULL)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@sekolah.sch.id' },
    update: {},
    create: {
      name: 'Super Admin Yayasan',
      email: 'superadmin@sekolah.sch.id',
      password: defaultPasswordAdmin,
      role: Role.SUPER_ADMIN,
      schoolUnitId: null, // Akses global
    },
  });

  // Akun Admin Unit SD (Hanya mengelola unit SD - schoolUnitId: 3)
  const adminSD = await prisma.user.upsert({
    where: { email: 'adminsd@sekolah.sch.id' },
    update: {},
    create: {
      name: 'Admin Keuangan SD',
      email: 'adminsd@sekolah.sch.id',
      password: defaultPasswordAdmin,
      role: Role.UNIT_ADMIN,
      schoolUnitId: unitSD.id,
    },
  });

  console.log('Data pengguna default berhasil disiapkan.');

  // 4. Seed Data Master: Kategori Transaksi Buku Kas (Categories)
  console.log('Seeding data kategori transaksi keuangan...');
  const defaultCategories = [
    { id: 1, name: 'SPP', type: CategoryType.INCOME, schoolUnitId: null },
    { id: 2, name: 'BOS', type: CategoryType.INCOME, schoolUnitId: null },
    { id: 3, name: 'Donatur', type: CategoryType.INCOME, schoolUnitId: null },
    { id: 4, name: 'Gaji Guru', type: CategoryType.EXPENSE, schoolUnitId: null },
    { id: 5, name: 'Operasional', type: CategoryType.EXPENSE, schoolUnitId: null },
  ];

  for (const cat of defaultCategories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        name: cat.name,
        type: cat.type,
        schoolUnitId: cat.schoolUnitId,
      },
    });
  }
  console.log('Kategori transaksi berhasil disiapkan.');

  // 5. Seed Data Master: Tarif SPP per Angkatan (SppTariff)
  console.log('Seeding data tarif dasar SPP angkatan...');
  // SD Angkatan 2024: Rp 150.000 / bulan
  await prisma.sppTariff.upsert({
    where: {
      uq_school_unit_enrollment_year: {
        schoolUnitId: unitSD.id,
        enrollmentYear: 2024,
      },
    },
    update: {},
    create: {
      schoolUnitId: unitSD.id,
      enrollmentYear: 2024,
      amount: 150000,
    },
  });

  // SD Angkatan 2025: Rp 175.000 / bulan
  await prisma.sppTariff.upsert({
    where: {
      uq_school_unit_enrollment_year: {
        schoolUnitId: unitSD.id,
        enrollmentYear: 2025,
      },
    },
    update: {
      developmentFee: 1500000,
      reRegistrationFee: 300000,
      equipmentFee: 500000,
    },
    create: {
      schoolUnitId: unitSD.id,
      enrollmentYear: 2025,
      amount: 175000,
      developmentFee: 1500000,
      reRegistrationFee: 300000,
      equipmentFee: 500000,
    },
  });

  // TK Angkatan 2025: Rp 120.000 / bulan
  await prisma.sppTariff.upsert({
    where: {
      uq_school_unit_enrollment_year: {
        schoolUnitId: unitRA.id,
        enrollmentYear: 2025,
      },
    },
    update: {
      developmentFee: 1000000,
      reRegistrationFee: 200000,
      equipmentFee: 400000,
      extracurricularFee: 250000,
      uniformFee: 600000,
    },
    create: {
      schoolUnitId: unitRA.id,
      enrollmentYear: 2025,
      amount: 120000,
      developmentFee: 1000000,
      reRegistrationFee: 200000,
      equipmentFee: 400000,
      extracurricularFee: 250000,
      uniformFee: 600000,
    },
  });
  console.log('Tarif dasar SPP berhasil disiapkan.');

  // 6. Seed Calon Siswa Baru PPDB Demo
  console.log('Seeding data calon siswa baru PPDB...');
  const parentPPDB = await prisma.user.upsert({
    where: { email: 'parent.budi@sekolah.sch.id' },
    update: {},
    create: {
      name: 'Wali Murid Budi (Demo PPDB)',
      email: 'parent.budi@sekolah.sch.id',
      password: defaultPasswordParent,
      role: Role.PARENT,
      phoneNumber: '081234567890',
    },
  });

  await prisma.student.upsert({
    where: { studentNumber: 'PPDB-2026-001' },
    update: {
      className: 'PPDB',
      parentId: parentPPDB.id,
    },
    create: {
      studentNumber: 'PPDB-2026-001',
      name: 'Budi Calon Siswa Baru',
      className: 'PPDB',
      schoolUnitId: unitSD.id,
      enrollmentYear: 2025,
      parentId: parentPPDB.id,
      discountAmount: 0,
    },
  });
  console.log('Calon siswa baru PPDB berhasil disiapkan.');

  // 7. Seed 30 Data Siswa dengan Berbagai Unit dan Kelas untuk Testing
  console.log('Seeding 30 data siswa tambahan...');
  const studentNames = [
    "Ahmad Fauzi", "Siti Aminah", "Muhammad Ridho", "Lani Cahyani", "Budi Santoso",
    "Dewi Lestari", "Rian Hidayat", "Indah Permata", "Yusuf Pratama", "Fitri Handayani",
    "Hadi Wijaya", "Rina Rahmawati", "Deni Saputra", "Mega Utami", "Andi Hermawan",
    "Sri Wahyuni", "Eko Prasetyo", "Ani Maryani", "Agus Setiawan", "Wulan Sari",
    "Fajar Nugroho", "Sari Indah", "Guntur Wibowo", "Kartika Putri", "Bambang Susilo",
    "Diana Rahma", "Joko Purwanto", "Novi Anggraini", "Taufik Rahman", "Nila Kartika"
  ];

  const units = [unitKB, unitRA, unitSD, unitTPA];

  for (let i = 0; i < 30; i++) {
    const isPPDB = i < 15; // 15 PPDB, 15 Regular
    const unitIndex = i % 4;
    const targetUnit = units[unitIndex];
    const studentNumber = isPPDB ? `PPDB-2026-${100 + i}` : `NIS-2025-${200 + i}`;
    
    let className = 'PPDB';
    if (!isPPDB) {
      if (targetUnit.id === 1) className = 'KB';
      else if (targetUnit.id === 2) className = i % 2 === 0 ? 'A1' : 'B1';
      else if (targetUnit.id === 3) className = i % 2 === 0 ? '1 Marwa' : '1 Mina';
      else if (targetUnit.id === 4) className = 'PPDB';
    }

    await prisma.student.upsert({
      where: { studentNumber },
      update: {
        name: studentNames[i],
        className,
        schoolUnitId: targetUnit.id,
        enrollmentYear: 2025,
        parentId: parentPPDB.id,
        discountAmount: i % 5 === 0 ? 15000 : 0,
      },
      create: {
        studentNumber,
        name: studentNames[i],
        className,
        schoolUnitId: targetUnit.id,
        enrollmentYear: 2025,
        parentId: parentPPDB.id,
        discountAmount: i % 5 === 0 ? 15000 : 0,
      }
    });
  }
  console.log('30 data siswa tambahan berhasil disiapkan.');

  console.log('🔄 Menyinkronkan database sequence auto-increment...');

  // Daftar tabel yang menggunakan ID auto-increment statis di seeder
  const tables = ['school_units', 'categories'];

  for (const tableName of tables) {
    await prisma.$executeRawUnsafe(`
      SELECT setval(
        pg_get_serial_sequence('"${tableName}"', 'id'),
        coalesce(max(id), 0) + 1,
        false
      ) FROM "${tableName}";
    `);
  }

  console.log('✅ Semua database sequence berhasil disinkronkan!');

  console.log('\n=== Proses Seeding Selesai dengan Sukses! ===');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Terjadi error saat proses seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

