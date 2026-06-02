import { Injectable, Logger, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AdminUser } from '../schemas/admin-user.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { hash, compare } from "bcryptjs";
import { AdminLoginDto } from '../dtos/admin-login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminUserService {

    private readonly logger = new Logger(AdminUserService.name);
    constructor(
        @InjectModel(AdminUser.name) private readonly adminUser: Model<AdminUser>,
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async createAdmin(createAdminDto: CreateAdminDto): Promise<AdminUser> {
        const { email, password } = createAdminDto;

        // Check if admin already exists
        const existingAdmin = await this.adminUser.findOne({ email });
        if (existingAdmin) {
            throw new ConflictException('Admin already exists');
        }

        // Hash password
        const hashedPassword = await hash(password, 10);


        return this.adminUser.create({ email, password: hashedPassword });
    }
    async createDefaultAdmin() {
        try {
            // Get credentials from .env
            const defaultEmail = this.configService.get<string>('ADMIN_EMAIL');
            const defaultPassword = this.configService.get<string>('ADMIN_PASSWORD');

            if (!defaultEmail || !defaultPassword) {
                this.logger.warn('Admin credentials not found in .env file. Skipping auto-creation.');
                return;
            }

            // Try to create admin (will fail if already exists)
            await this.createAdmin({
                email: defaultEmail,
                password: defaultPassword,
            });

            this.logger.log(`Default admin created successfully with email: ${defaultEmail}`);
        } catch (error) {
            if (error.message.includes('already exists')) {
                this.logger.log('Default admin already exists. Skipping creation.');
            } else {
                this.logger.error(`Failed to create default admin: ${error.message}`);
            }
        }
    }

    async login(loginAdminDto: AdminLoginDto) {
        const { email, password } = loginAdminDto;
        const admin = await this.adminUser.findOne({ email });
        if (!admin) {
            throw new NotFoundException('Admin not found');
        }
        const isMatch = await compare(password, admin.password);
        if (!isMatch) {
            throw new BadRequestException('Invalid credentials');
        }

        const payload = { id: admin._id };
        const token = await this.jwtService.signAsync(payload);

        await this.adminUser.findByIdAndUpdate(admin._id, { lastLoginAt: new Date().toUTCString() });

        return {
            token,
        };
    }
}
