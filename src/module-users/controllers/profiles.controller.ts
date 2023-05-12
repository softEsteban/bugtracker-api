import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { ProfilesService } from '../services/profiles.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Profiles services')
@Controller('profiles')
export class ProfilesController {

    constructor(private profilesService: ProfilesService) { }

    @Get('/getAllProfiles')
    @ApiOperation({ summary: 'Gets all profiles' })
    async getAllProfiles() {
        return this.profilesService.getAllProfiles();
    }
}
