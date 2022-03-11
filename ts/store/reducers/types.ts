import { PersistPartial } from "redux-persist";
import { VersionInfoState } from "../../common/versionInfo/store/reducers/versionInfo";

import { BonusState } from "../../features/bonus/bonusVacanze/store/reducers";
import { PersistedFeaturesState } from "../../features/common/store/reducers";
import { AppState } from "./appState";
import { AssistanceToolsState } from "./assistanceTools";
import { PersistedAuthenticationState } from "./authentication";
import { BackendStatusState } from "./backendStatus";
import { BackoffErrorState } from "./backoffError";
import { CieState } from "./cie";
import { ContentState } from "./content";
import { CrossSessionsState } from "./crossSessions";
import { DebugState } from "./debug";
import { EmailValidationState } from "./emailValidation";
import { PersistedEntitiesState } from "./entities";
import { PersistedIdentificationState } from "./identification";
import { InstabugUnreadMessagesState } from "./instabug/instabugUnreadMessages";
import { InstallationState } from "./installation";
import { InternalRouteNavigationState } from "./internalRouteNavigation";
import { NavigationState } from "./navigation";
import { NotificationsState } from "./notifications";
import { OnboardingState } from "./onboarding";
import { PaymentsState } from "./payments";
import { PersistedPreferencesState } from "./persistedPreferences";
import { PreferencesState } from "./preferences";
import { ProfileState } from "./profile";
import { SearchState } from "./search";
import { UserDataProcessingState } from "./userDataProcessing";
import { UserMetadataState } from "./userMetadata";
import { WalletState } from "./wallet";

export type GlobalState = Readonly<{
  appState: AppState;
  navigation: NavigationState;
  authentication: PersistedAuthenticationState;
  backendStatus: BackendStatusState;
  versionInfo: VersionInfoState;
  entities: PersistedEntitiesState;
  instabug: InstabugUnreadMessagesState;
  backoffError: BackoffErrorState;
  notifications: NotificationsState;
  onboarding: OnboardingState;
  profile: ProfileState;
  userDataProcessing: UserDataProcessingState;
  wallet: WalletState;
  preferences: PreferencesState;
  persistedPreferences: PersistedPreferencesState;
  content: ContentState;
  identification: PersistedIdentificationState;
  installation: InstallationState;
  debug: DebugState;
  search: SearchState;
  payments: PaymentsState;
  userMetadata: UserMetadataState;
  emailValidation: EmailValidationState;
  cie: CieState;
  bonus: BonusState;
  features: PersistedFeaturesState;
  internalRouteNavigation: InternalRouteNavigationState;
  crossSessions: CrossSessionsState;
  assistanceTools: AssistanceToolsState;
}>;

export type PersistedGlobalState = GlobalState & PersistPartial;
