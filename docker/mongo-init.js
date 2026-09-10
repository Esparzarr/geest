// MongoDB ejecuta este script automáticamente la primera vez que se inicializa
// el volumen de datos (ver /docker-entrypoint-initdb.d en la imagen oficial).
//
// Siembra el usuario de prueba. La API no expone creación de usuarios ni
// contiene código que los cree: solo los lee para autenticar.
//
// El hash corresponde a la contraseña "Test1234!" con bcrypt, 10 rondas.

const now = new Date()

db.users.insertOne({
  username: 'testuser',
  password: '$2b$10$/1QNxJDQoV77l38tXmJTIOG5MBlfxe2NkTfydYdDB2UHaau25J/Aa',
  createdAt: now,
  updatedAt: now,
  __v: 0,
})

// Mismo índice que declara el esquema de Mongoose.
db.users.createIndex({ username: 1 }, { unique: true })

print('Usuario de prueba creado: testuser / Test1234!')
