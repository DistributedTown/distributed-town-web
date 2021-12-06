import { SwQuote } from 'sw-web-shared';
import { useSelector } from 'react-redux';
import { SwUserSkillsLegend } from '@dito-components/user-skills-legend';
import { RootState } from '@dito-store/store.model';
import { getCredits, getSkillCredits } from '../store/join.reducer';
import './community-credits.scss';

function CommunityCredits() {
  const totalCredits = useSelector(getCredits);
  const creditSkills = useSelector(getSkillCredits) as any;
  const userInfo = useSelector((state: RootState) => state.joinCommunity.userInfo);
  return (
    <SwQuote showBorder={false} className="sw-credits">
      <SwUserSkillsLegend
        showCreditAmount
        username={userInfo?.name}
        avatar={userInfo?.avatar}
        creditSkills={creditSkills}
        totalCredits={totalCredits}
      />
    </SwQuote>
  );
}

export default CommunityCredits;
