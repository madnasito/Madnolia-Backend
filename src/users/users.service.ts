import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
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

    getInfo = async(user: string) => await this.userModel.findOne({_id: user, status: true})

    // getInvitations = async (user: string) => this.userModel.populate('')

    upadte = async (user: string, attrs: Partial<User>) => this.userModel.findOneAndUpdate({_id: user}, attrs, {new: true});

    searchUser = async (username: string) => {
        let regex = new RegExp(username, 'i')

        return await this.userModel.find({username: regex, status: true})
            .limit(5)
    }

    resetNotifications = async (user: string) => this.userModel.findOneAndUpdate({_id: user}, {notification: 0}, {new: true})
    
    getUserPartners = async (user: string) => 
        this.userModel
        .findOne(
            {_id: user},
            {},
            {populate: {path: 'partners',match: { status: true},  select: 'name username img'}
        })
    
    addPartner = async (user: string, partner: string) => {
        const verifiedUser = await this.getInfo(partner);

        if(!verifiedUser) throw new NotFoundException()

        return this.userModel.findOneAndUpdate({_id: user}, {$push: {partners: partner}}, {new: true})
    }

    
}