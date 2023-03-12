import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { ProfilesService } from '../services/profiles.service';
// import { JwtAuthGuard } from '../../module-auth/jwt.auth.guard.service';

// @UseGuards(JwtAuthGuard)
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
