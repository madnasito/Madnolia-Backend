import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>){}

    fincOneByUsername = async(username: string) => {
        const user = await this.userModel.findOne({username})
        return user;
    }

    findOneByEmail = async(email: string) => {
        const user = await this.userModel.findOne({email})
        return user;
    }

    
}