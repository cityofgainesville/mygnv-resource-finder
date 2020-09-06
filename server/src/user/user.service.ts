import { Injectable, HttpException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import {
    User,
    UserType,
    UpdateUserDto,
    Role,
    UpdatePasswordDto,
    UserResponseDto,
} from './user.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import bcrypt from 'bcrypt';
import { QueryPopulateOptions } from 'mongoose';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
        @InjectModel(User)
        private readonly UserModel: ReturnModelType<typeof User>
    ) {}

    private queryPopulateOptions(
        categories: string,
        resources: string,
        locations: string,
        user: User
    ): QueryPopulateOptions[] {
        let populateOptions = [];
        if (categories?.toLowerCase() === 'true')
            populateOptions = [...populateOptions, 'cat_can_edit_members'];
        if (resources?.toLowerCase() === 'true')
            populateOptions = [...populateOptions, 'resource_can_edit'];
        if (locations?.toLowerCase() === 'true')
            populateOptions = [...populateOptions, 'location_can_edit'];
        let select = '';
        // Ignore private data when populating
        if (user?.role !== Role.OWNER) {
            select = '-maintainer_contact_info';
        }
        return populateOptions.map((path) => {
            const option: QueryPopulateOptions = { path, select };
            return option;
        });
    }

    async findOneByEmail(email: string): Promise<UserType | undefined> {
        return this.UserModel.findOne({ email: email });
    }

    async list(
        categories: string,
        resources: string,
        locations: string,
        filter: object,
        user: User
    ): Promise<UserResponseDto[]> {
        if (user?.role !== Role.OWNER)
            throw new HttpException('Unauthorized', 401);
        filter = filter ? filter : {};
        return await this.UserModel.find(filter).populate(
            this.queryPopulateOptions(categories, resources, locations, user)
        );
    }

    async read(
        id: string,
        categories: string,
        resources: string,
        locations: string,
        user: User
    ): Promise<UserResponseDto> {
        if (user?.role !== Role.OWNER && user?.id !== id)
            throw new HttpException('Unauthorized', 401);
        return (await this.UserModel.findById(id)).populate(
            this.queryPopulateOptions(categories, resources, locations, user)
        );
    }

    async update(
        id: string,
        updateUserDto: UpdateUserDto,
        user: User
    ): Promise<User> {
        try {
            if (user?.role !== Role.OWNER && user?.id !== id)
                throw new HttpException('Unauthorized', 401);
            const userToUpdate = await this.UserModel.findById(id);

            if (user?.role === Role.OWNER) {
                for (const key in updateUserDto) {
                    if (
                        Object.prototype.hasOwnProperty.call(
                            updateUserDto,
                            key
                        ) &&
                        key !== 'password' &&
                        key !== 'old_password' &&
                        key !== 'updated_at' &&
                        key !== 'created_at' &&
                        key !== '_id' &&
                        key !== '__v'
                    ) {
                        userToUpdate[key] = updateUserDto[key];
                    }
                }
            } else {
                userToUpdate.first_name = updateUserDto.first_name;
                userToUpdate.last_name = updateUserDto.last_name;
            }
            if (updateUserDto.password) {
                if (user?.role === Role.OWNER) {
                    userToUpdate.hash = await this.authService.hashPassword(
                        updateUserDto.password.new_password
                    );
                } else {
                    await this.changePassword(
                        userToUpdate,
                        updateUserDto.password
                    );
                }
            }
            await userToUpdate.save();
            return userToUpdate;
        } catch (error) {
            throw new HttpException(error.message, 200);
        }
    }

    private async changePassword(
        user: User,
        passwordDto: UpdatePasswordDto
    ): Promise<void> {
        if (await bcrypt.compare(passwordDto.old_password, user.hash)) {
            user.hash = await this.authService.hashPassword(
                passwordDto.new_password
            );
        } else throw new HttpException('Old password not correct', 401);
    }

    async delete(id: string, user: User): Promise<void> {
        if (user?.role !== Role.OWNER)
            throw new HttpException('Unauthorized', 401);
        try {
            const user = await this.UserModel.findById(id);
            await user.deleteOne();
        } catch (error) {
            throw new HttpException(error.message, 200);
        }
    }
}
