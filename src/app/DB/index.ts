import config from '../config';
import { USER_ROLE } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';

const superUser = {
    id: 'SA01',
    email: 'admin@gmail.com',
    password: config.super_admin_password,
    needPasswordChange: false,
    role: USER_ROLE.superAdmin,
    status: 'in-progress',
    isDeleted: false,
};

const seedSuperAdmin = async () => {
    const isSuperAdminExist = await User.find({ role: USER_ROLE.superAdmin });

    if (isSuperAdminExist.length === 0) {
        const a = await User.create(superUser);
        console.log('Super Admin Created: ', a);
    }
};

export default seedSuperAdmin;
