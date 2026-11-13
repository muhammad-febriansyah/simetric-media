import type { LucideIcon, LucideProps } from 'lucide-react';
import {
    BriefcaseIcon,
    Building2Icon,
    CodeIcon,
    CompassIcon,
    FactoryIcon,
    GraduationCapIcon,
    HardHatIcon,
    LandmarkIcon,
    LifeBuoyIcon,
    PenToolIcon,
    PickaxeIcon,
    SearchCheckIcon,
    StethoscopeIcon,
    StoreIcon,
    TractorIcon,
    TruckIcon,
    WorkflowIcon,
    ZapIcon,
} from 'lucide-react';

/**
 * Icons that admins can pick by name for services and industries.
 */
export const contentIcons: Record<string, LucideIcon> = {
    briefcase: BriefcaseIcon,
    building: Building2Icon,
    code: CodeIcon,
    compass: CompassIcon,
    factory: FactoryIcon,
    'graduation-cap': GraduationCapIcon,
    'hard-hat': HardHatIcon,
    landmark: LandmarkIcon,
    'life-buoy': LifeBuoyIcon,
    'pen-tool': PenToolIcon,
    pickaxe: PickaxeIcon,
    'search-check': SearchCheckIcon,
    stethoscope: StethoscopeIcon,
    store: StoreIcon,
    tractor: TractorIcon,
    truck: TruckIcon,
    workflow: WorkflowIcon,
    zap: ZapIcon,
};

export function ContentIcon({
    iconName,
    ...props
}: LucideProps & { iconName: string | null }) {
    const Icon = (iconName && contentIcons[iconName]) || BriefcaseIcon;

    return <Icon {...props} />;
}
