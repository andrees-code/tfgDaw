import mongoose from 'mongoose';
import { UserSchema } from '../user/schemas/user.schema/user.schema';

const User = mongoose.model('User', UserSchema);

async function setAnnualSubscription() {
  try {
    await mongoose.connect('mongodb+srv://a1:a1@mongodb.pioui.mongodb.net/Ponte_a_Prueba');

    const email = 'whinky2013@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
      console.log('Usuario no encontrado');
      await mongoose.disconnect();
      return;
    }

    user.subscription = {
      plan: 'yearly',
      status: 'active',
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    };

    await user.save();
    console.log(`Se asignó suscripción anual a ${user.username}`);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

setAnnualSubscription();
