import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { yellow } from '@mui/material/colors';

export default function Card3() {
  return (
    <Card sx={{ maxWidth: 345, bgcolor: '#1e1e1e', color: 'white'}}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: yellow[500] }} aria-label="recipe">
            U
          </Avatar>
        }
        titleTypographyProps={{ sx: { color: 'white', fontWeight: 600 } }}
        subheaderTypographyProps={{ sx: { color: 'white', opacity: 0.8 } }}
        title="Usama Patel"
        subheader="February 14, 2025"
      />
      <CardMedia
        component="img"
        height="194"
        image="https://everydaydishes.com/wp-content/uploads/2015/03/crunchy-pork-cutlets-video-everydaydishes_com-H.jpg"
        alt="Tonkatsu"
        style={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
          What really gets me is that hit of carom seeds in the batter. its so unique and pairs perfectly with the lemon
        </Typography>
      </CardContent>
    </Card>
  );
}
