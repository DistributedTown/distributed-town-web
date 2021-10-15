import { Card, CardContent, Typography, Box, Avatar, CardHeader, CardActionArea } from '@mui/material';
import { red } from '@mui/material/colors';
import { CommunityCategory } from '../store/model';
import './community-card.scss';

function CommunityCard({
  community,
  selectedCommunity,
  onSelect,
  inactive,
}: {
  inactive: boolean;
  community: CommunityCategory;
  selectedCommunity: string;
  onSelect: (communityName: string) => any;
}) {
  return (
    <Card
      onClick={() => !inactive && onSelect(community.name)}
      className={`sw-community-card ${selectedCommunity === community.name ? 'active' : ''} ${inactive ? 'inactive' : ''}`}
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
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  R
                </Avatar>
              }
              title={
                <Typography variant="h5" color="primary.main">
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
