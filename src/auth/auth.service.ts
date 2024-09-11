import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/user/schemas/user.schema";
import { SignUpDto } from "./dtos/sign-up.dtio";
import { hash as bcryptHash, genSalt } from "bcrypt"
@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>){}

    signup = async(signUpDto: SignUpDto) => {
        const emailDb = await this.findOneByEmail(signUpDto.email);

        if(emailDb){
            throw new BadRequestException('Email in use');
        }

        const userDb = await this.fincOneByUsername(signUpDto.username);
        if(userDb){
            throw new BadRequestException('Username in use');
        }

        const createdUser = new this.userModel(signUpDto);

        const saltOrRounds = 10;
        const password = signUpDto.password;
        const hash = await bcryptHash(password, saltOrRounds);
        const salt = await genSalt();
        console.log(salt);

        createdUser.password = hash

        return createdUser.save()
    }


    fincOneByUsername = async(username: string) => {
        const user = await this.userModel.findOne({username})
        return user;

    }

    findOneByEmail = async(email: string) => {
        const user = await this.userModel.findOne({email})
        return user;
    }

}