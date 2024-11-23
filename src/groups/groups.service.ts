import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schema/group.schema';
import { Model } from 'mongoose';
import { CreateGroupDto } from './dtos/create-group.dto';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}

  create(createGroupDto: CreateGroupDto, user: string) {
    const createdGroup = new this.groupModel({
      ...createGroupDto,
      admin: user,
    });

    return createdGroup.save();
  }

  update = async (group: string, user: string, attrs: Partial<Group>) =>
    this.groupModel.findOneAndUpdate({ _id: group, admin: user }, attrs, {
      new: true,
    });

  addMember = async (group: string, user: string, member: string) => {
    const groupDb = await this.groupModel.findOne({
      _id: group,
      members: user,
    });

    if (!groupDb) throw new NotFoundException('GROUP_NOT_FOUND');

    if (groupDb.joinRequestAdminApproval && groupDb.admin.toString() != user) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    if (groupDb.admin.toString() == user || !groupDb.joinRequestAdminApproval) {
      return this.groupModel.findOneAndUpdate(
        { _id: group },
        { $push: { members: member } },
      );
    }
  };

  deleteMember = async (group: string, user: string, member: string) => {
    return this.groupModel.findOneAndUpdate(
      { _id: group, admin: user, members: member },
      { $pull: { members: member } },
      { new: true },
    );
  };

  exitFromGroup = async (group: string, user: string) => {
    return this.groupModel.findOneAndUpdate(
      { _id: group, members: user },
      { $pull: { members: user } },
      { new: true },
    );
  };
}
