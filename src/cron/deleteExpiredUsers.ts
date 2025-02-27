// import sequelize from "../config/database";
// import Auth from "../database/models/auth";
// import Profile from "../database/models/profile";
// import Purchase from "../database/models/Purchase";
// import Transactions from "../database/models/transaction";
// import User from "../database/models/user";
// import Wallet from "../database/models/wallet";

// import cron from 'node-cron';
// import { Op } from 'sequelize';

// cron.schedule('0 0 * * *', async () => { 
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//     const usersToDelete = await User.findAll({ where: { deletedAt: { [Op.lte]: thirtyDaysAgo } } });

//     for (const user of usersToDelete) {
//         const transaction = await sequelize.transaction();
//         try {
//             const userId = user.id;

//             await Profile.destroy({ where: { userId }, transaction });
//             await Purchase.destroy({ where: { userId }, transaction });
//             await Wallet.destroy({ where: { userId }, transaction });
//             await Transactions.destroy({ where: { userId }, transaction });
//             await Auth.destroy({ where: { userId }, transaction });
//             await user.destroy({ transaction });

//             await transaction.commit();
//         } catch (error) {
//             await transaction.rollback();
//             console.error('Error deleting user:', error);
//             //next(new ErrorResponse('Error deleting user',))
            
//             throw new Error(`Error Deleting user`);
//         }
//     }
// });