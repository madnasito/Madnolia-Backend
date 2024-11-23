import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schema/group.schema';
import { Model } from 'mongoose';
import { CreateGroupDto } from './dtos/create-group.dto';
import { JoinRequestApproval } from './schema/join-request-approval.enum';
import { UserGroupDto } from './dtos/user-group.dto';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group.name) private groupModel: Model<Group>) {}

  create(createGroupDto: CreateGroupDto, user: string) {
    createGroupDto.members.push(user);

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

  addMember = async (userGroupDto: UserGroupDto, member: string) => {
    const groupDb = await this.groupModel.findOne({
      _id: userGroupDto.group,
      $or: [{ admin: member }, { members: member }],
    });

    if (!groupDb) throw new NotFoundException('GROUP_NOT_FOUND');

    if (
      groupDb.joinRequestApproval == JoinRequestApproval.ADMIN &&
      groupDb.admin.toString() != member
    ) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    if (groupDb.admin.toString() == member || !groupDb.joinRequestApproval) {
      return this.groupModel.findOneAndUpdate(
        { _id: userGroupDto.group },
        { $push: { members: userGroupDto.user } },
      );
    }
  };

  deleteMember = async (userGroupDto: UserGroupDto, admin: string) => {
    return this.groupModel.findOneAndUpdate(
      { _id: userGroupDto.group, admin, members: userGroupDto.user },
      { $pull: { members: userGroupDto.user } },
      { new: true },
    );
  };

  // TO-DO: Finish this
  requestToJoin = async (group: string, user: string) => {
    return this.groupModel.findOne(
      {
        _id: group,
        $or: [{ banned: user }, { members: user }],
      },
      //   { $push: { members: user } },
    );
  };

  exitFromGroup = async (group: string, user: string) => {
    return this.groupModel.findOneAndUpdate(
      { _id: group, members: user, admin: { $ne: user } },
      { $pull: { members: user } },
      { new: true },
    );
  };

  changeAdmin(userGroupDto: UserGroupDto, admin: string) {
    return this.groupModel.findOneAndUpdate(
      {
        _id: userGroupDto.group,
        admin,
        members: userGroupDto.user,
      },
      { admin: userGroupDto.user },
      { new: true },
    );
  }
}
