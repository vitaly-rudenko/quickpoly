import { AuctionSpace } from './spaces/AuctionSpace';
import { BirthdayGiftSpace } from './spaces/BirthdayGiftSpace';
import { BusTicketSpace } from './spaces/BusTicketSpace';
import { ChanceSpace } from './spaces/chance/ChanceSpace';
import { CommunityChestSpace } from './spaces/community-chest/CommunityChestSpace';
import { FreeParkingSpace } from './spaces/FreeParkingSpace';
import { GoSpace } from './spaces/GoSpace';
import { GoToJailSpace } from './spaces/GoToJailSpace';
import { IncomeTaxSpace } from './spaces/IncomeTaxSpace';
import { JailSpace } from './spaces/JailSpace';
import { LuxuryTaxSpace } from './spaces/LuxuryTaxSpace';
import { RailroadSpace } from './spaces/properties/RailroadSpace';
import { StreetSpace } from './spaces/properties/StreetSpace';
import { UtilitySpace } from './spaces/properties/UtilitySpace';

export interface GameData {
    spaces: Space[]
}

export type Space = (
    AuctionSpace |
    BirthdayGiftSpace |
    BusTicketSpace |
    FreeParkingSpace |
    GoSpace |
    GoToJailSpace |
    IncomeTaxSpace |
    JailSpace |
    LuxuryTaxSpace |
    ChanceSpace |
    CommunityChestSpace |
    RailroadSpace |
    StreetSpace |
    UtilitySpace
);
