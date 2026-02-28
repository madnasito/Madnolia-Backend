import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schema/group.schema';
import { Model, Types } from 'mongoose';
import { CreateGroupDto } from './dtos/create-group.dto';
import { JoinRequestApproval } from './enums/join-request-approval.enum';
import { UserGroupDto } from './dtos/user-group.dto';
import { UpdateGroupDto } from './dtos/update-group.dto';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<Group>,
    private readonly usersService: UsersService,
  ) {}

  create(createGroupDto: CreateGroupDto, user: string) {
    createGroupDto.members.push(user);

    const createdGroup = new this.groupModel({
      ...createGroupDto,
      admin: user,
    });

    return createdGroup.save();
  }

  getGroupInfo = async (id: string) => {
    const group = await this.groupModel.findOne({
      _id: new Types.ObjectId(id),
    } as any);

    if (!group) throw new NotFoundException('NO_GROUP');

    return group;
  };

  update = async (user: string, body: UpdateGroupDto) => {
    const groupDb = await this.groupModel.findOne({
      _id: new Types.ObjectId(body.id),
    } as any);

    if (!groupDb) throw new NotFoundException('NO_GROUP');

    if ((groupDb.admin as any).toString() != user) {
      throw new UnauthorizedException();
    }

    return this.groupModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(body.id),
      } as any,
      { ...body, modifiedAt: new Date() },
      { new: true },
    );
  };

  addMember = async (userGroupDto: UserGroupDto, member: string) => {
    const groupDb = await this.groupModel.findOne({
      _id: new Types.ObjectId(userGroupDto.group),
      $or: [{ admin: member }, { members: member }],
      members: { $ne: userGroupDto.user },
      banned: { $ne: userGroupDto.user },
    } as any);

    if (!groupDb) throw new NotFoundException('GROUP_NOT_FOUND');

    await this.usersService.findOneById(userGroupDto.user);

    if (
      groupDb.joinRequestApproval == JoinRequestApproval.ADMIN &&
      (groupDb.admin as any).toString() != member
    ) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    if (
      (groupDb.admin as any).toString() == member ||
      groupDb.joinRequestApproval == JoinRequestApproval.MEMBERS ||
      groupDb.joinRequestApproval == JoinRequestApproval.NO
    ) {
      return this.groupModel.findOneAndUpdate(
        { _id: new Types.ObjectId(userGroupDto.group) } as any,
        {
          $push: { members: userGroupDto.user },
          $pull: { requests: userGroupDto.user },
        },
        { new: true },
      );
    }
  };

  deleteMember = async (userGroupDto: UserGroupDto, admin: string) => {
    const groupDb = await this.groupModel.findOne({
      _id: new Types.ObjectId(userGroupDto.group),
      members: userGroupDto.user,
    } as any);

    if (!groupDb) throw new NotFoundException('NOT_FOUND');

    if ((groupDb.admin as any).toString() != admin) {
      throw new UnauthorizedException();
    }

    return this.groupModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(userGroupDto.group),
        admin,
        members: userGroupDto.user,
      } as any,
      { $pull: { members: userGroupDto.user } },
      { new: true },
    );
  };

  requestToJoin = async (group: string, user: string) => {
    const groupDb = await this.groupModel.findOne({
      _id: new Types.ObjectId(group),
      $nor: [{ banned: user }, { members: user }, { requests: user }],
    } as any);

    if (!groupDb) throw new NotFoundException('NOT_FOUND');

    if (
      groupDb.joinRequestApproval == JoinRequestApproval.ADMIN ||
      groupDb.joinRequestApproval == JoinRequestApproval.MEMBERS
    ) {
      return this.groupModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(group),
          $nor: [{ banned: user }, { members: user }],
        } as any,
        { $push: { requests: user } },
        { new: true },
      );
    } else if (groupDb.joinRequestApproval == JoinRequestApproval.NO) {
      return this.groupModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(group),
          $nor: [{ banned: user }, { members: user }],
        } as any,
        { $push: { members: user } },
        { new: true },
      );
    }
  };

  leaveGroup = async (group: string, user: string) => {
    return this.groupModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(group),
        members: user,
        admin: { $ne: user },
      } as any,
      { $pull: { members: user } },
      { new: true },
    );
  };

  changeAdmin(userGroupDto: UserGroupDto, admin: string) {
    return this.groupModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(userGroupDto.group),
        admin,
        members: userGroupDto.user,
      } as any,
      { admin: userGroupDto.user },
      { new: true },
    );
  }
}
