import { Card, CardContent, Typography, Box, Avatar, CardHeader, ThemeOptions, useMediaQuery } from '@mui/material';
import { SwButton } from 'sw-web-shared';
import { CommunityCategory } from '../store/model';
import './community-card.scss';

function CommunityCard({
  community,
  selectedCommunityName,
  onSelect,
}: {
  community: CommunityCategory;
  selectedCommunityName: string;
  onSelect: (communityName: string) => any;
}) {
  const inactive = community.members >= community.totalMembersAllowed;
  const small = useMediaQuery((theme: ThemeOptions) => theme.breakpoints.down('sm'));
  return (
    <Card
      sx={{ p: 0 }}
      onClick={() => !inactive && onSelect(community.name)}
      className={`sw-community-card ${selectedCommunityName === community.name ? 'active' : ''} ${inactive ? 'inactive' : ''}`}
    >
      <CardContent sx={{ display: 'flex', p: 0 }}>
        <Box sx={{ flex: '1' }}>
          <CardHeader
            sx={{
              bgcolor: inactive ? 'text.primary' : 'white',
              pt: 0,
              pb: 0,
              '.MuiCardHeader-avatar': {
                background: 'black',
                height: '100%',
                padding: '10px',
              },
            }}
            avatar={<Avatar sx={{ width: 55, height: 55 }} src={community.image} />}
            title={
              <Typography variant={small ? 'h6' : 'h5'} color="primary.main">
                {community.name}
              </Typography>
            }
            subheader={
              <div className="car-subtitle">
                <Typography variant="body1" color="text.secondary">
                  {`Members: ${community.members} / `} <small>{community.totalMembersAllowed}</small>
                </Typography>
                <Typography sx={{ px: 1 }} variant="body1" color="text.secondary">
                  |
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {`Scarcity score: ${community.scarcityScore}`}
                </Typography>
              </div>
            }
          />
          <Typography className="card-description" bgcolor="primary.main" sx={{ p: 2 }} variant="body2">
            {community.description}
          </Typography>
          <Box className="can-accept-in">
            <Typography color="primary.main" sx={{ flex: 1 }} variant="body2">
              Accepting new diTizens?
            </Typography>
            <SwButton
              sx={{ flex: 1 }}
              onClick={() => !inactive && onSelect(community.name)}
              label={inactive ? 'No' : 'Yes'}
              className={selectedCommunityName === community.name ? 'active-link' : ''}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CommunityCard;
