import { Card, CardContent, Typography, Box, Avatar, CardHeader, CardActionArea, ThemeOptions, useMediaQuery } from '@mui/material';
import { red } from '@mui/material/colors';
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
      onClick={() => !inactive && onSelect(community.name)}
      className={`sw-community-card ${selectedCommunityName === community.name ? 'active' : ''} ${inactive ? 'inactive' : ''}`}
    >
      <CardActionArea disabled={inactive}>
        <CardContent sx={{ display: 'flex' }}>
          <Box sx={{ flex: '1' }}>
            <CardHeader
              sx={{
                boxShadow: 1,
                bgcolor: inactive ? 'secondary.main' : 'white',
                py: '8px',
              }}
              avatar={<Avatar sx={{ width: 50, height: 50 }} src={community.image} />}
              title={
                <Typography variant={small ? 'h6' : 'h5'} color="primary.main">
                  {community.name}
                </Typography>
              }
              subheader={
                <div className="car-subtitle">
                  <Typography variant="body1" color="text.secondary">
                    {`Members: ${community.members}`}
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
            <Typography className="card-description" sx={{ pb: 2, pt: 2 }} variant="body2">
              {community.description}
            </Typography>
          </Box>

          <Box className="can-accept-in" sx={{ width: '170px' }}>
            <Typography sx={{ pb: 2, pt: 2 }} variant="body2">
              Accepting new diTizens?
            </Typography>
            <div className={`toggle-circle ${inactive ? 'not-accepting' : 'accepting'}`}>{inactive ? 'No' : 'Yes'}</div>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default CommunityCard;
