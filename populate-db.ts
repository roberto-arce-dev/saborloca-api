import axios from 'axios';

const API_URL = 'https://saborloca-api.onrender.com';

const productores = [
  {
    email: 'productor1@example.com',
    password: 'password123',
    role: 'PRODUCTOR',
    nombre: 'Juan Perez',
    telefono: '+56911111111',
    direccion: 'Fundo El Roble, Valparaíso',
    nombreNegocio: 'Frutos del Valle',
    descripcion: 'Frutas frescas de temporada',
  },
  {
    email: 'productor2@example.com',
    password: 'password123',
    role: 'PRODUCTOR',
    nombre: 'Maria Gonzalez',
    telefono: '+56922222222',
    direccion: 'Parcela 5, Curacaví',
    nombreNegocio: 'Hortalizas Maria',
    descripcion: 'Verduras orgánicas sin pesticidas',
  },
  {
    email: 'productor3@example.com',
    password: 'password123',
    role: 'PRODUCTOR',
    nombre: 'Pedro Soto',
    telefono: '+56933333333',
    direccion: 'Camino Real 123, Melipilla',
    nombreNegocio: 'Quesos del Campo',
    descripcion: 'Quesos artesanales de vaca y cabra',
  },
];

const productosBase = [
  { nombre: 'Manzanas Fuji', precio: 1500, unidad: 'kg', categoria: 'frutas', descripcion: 'Manzanas dulces y crujientes' },
  { nombre: 'Lechuga Hidropónica', precio: 1000, unidad: 'unidad', categoria: 'verduras', descripcion: 'Lechuga fresca lista para comer' },
  { nombre: 'Tomate Limachino', precio: 2000, unidad: 'kg', categoria: 'verduras', descripcion: 'El verdadero sabor del tomate' },
  { nombre: 'Queso Fresco', precio: 3500, unidad: 'unidad', categoria: 'lacteos', descripcion: 'Queso fresco artesanal 500g' },
  { nombre: 'Miel de Ulmo', precio: 5000, unidad: 'unidad', categoria: 'despensa', descripcion: 'Miel 100% natural 1kg' },
];

async function populate() {
  console.log('🚀 Iniciando población de base de datos...');

  for (const [index, prodData] of productores.entries()) {
    try {
      console.log(`\n👤 Registrando productor: ${prodData.nombreNegocio}...`);
      
      // 1. Registrar o Login
      let token;
      try {
        const registerRes = await axios.post(`${API_URL}/auth/register`, prodData);
        token = registerRes.data.data.access_token;
        console.log('✅ Registrado exitosamente');
      } catch (error: any) {
        if (error.response?.status === 409) {
          console.log('⚠️ Usuario ya existe, intentando login...');
          const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: prodData.email,
            password: prodData.password,
          });
          token = loginRes.data.data.access_token;
          console.log('✅ Login exitoso');
        } else {
          throw error;
        }
      }

      // 2. Crear Productos
      console.log(`📦 Creando productos para ${prodData.nombreNegocio}...`);
      const headers = { Authorization: `Bearer ${token}` };

      for (let i = 0; i < 5; i++) {
        const baseProd = productosBase[i];
        const producto = {
          ...baseProd,
          nombre: `${baseProd.nombre} - ${prodData.nombreNegocio}`, // Diferenciar nombres
          stock: Math.floor(Math.random() * 50) + 10,
          disponible: true,
        };

        try {
          await axios.post(`${API_URL}/producto`, producto, { headers });
          console.log(`  - Producto creado: ${producto.nombre}`);
        } catch (error: any) {
          console.error(`  ❌ Error creando producto ${producto.nombre}:`, error.response?.data || error.message);
        }
      }

    } catch (error: any) {
      console.error(`❌ Error procesando productor ${prodData.email}:`, error.response?.data || error.message);
    }
  }

  console.log('\n✨ Proceso finalizado.');
}

populate();
