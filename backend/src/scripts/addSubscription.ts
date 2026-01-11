import mongoose from 'mongoose';
import { UserSchema } from '../user/schemas/user.schema/user.schema'; // Ajusta la ruta a tu archivo real

// Modelo
const User = mongoose.model('User', UserSchema);

async function addDefaultSubscription() {
  try {
    // Conecta a tu base de datos (sin opciones obsoletas)
    await mongoose.connect('mongodb+srv://a1:a1@mongodb.pioui.mongodb.net/Ponte_a_Prueba');

    console.log('Conectado a la base de datos');

    // Encontrar usuarios que NO tengan subscription definida
    const usersWithoutSubscription = await User.find({ subscription: { $exists: false } });
    console.log(`Usuarios sin suscripción: ${usersWithoutSubscription.length}`);

    for (const user of usersWithoutSubscription) {
      user.subscription = {
        plan: 'free',
        status: 'active',
        startDate: new Date(),
        // Para endDate usamos undefined en lugar de null
        endDate: undefined,
      };
      await user.save();
    }

    console.log(`Se actualizaron ${usersWithoutSubscription.length} usuarios con suscripción gratuita`);

    await mongoose.disconnect();
    console.log('Desconectado de la base de datos');
  } catch (err) {
    console.error('Error actualizando usuarios:', err);
  }
}

addDefaultSubscription();
