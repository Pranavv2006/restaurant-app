import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';

export default function Card1() {
  return (
    <Card sx={{ maxWidth: 345, bgcolor: '#1e1e1e', color: 'white'}}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
            S
          </Avatar>
        }
        titleTypographyProps={{ sx: { color: 'white', fontWeight: 600 } }}
        subheaderTypographyProps={{ sx: { color: 'white', opacity: 0.8 } }}
        title="Siddharth Chaudhary"
        subheader="September 25, 2025"
      />
      <CardMedia
        component="img"
        height="194"
        image="https://spiceeats.com/wp-content/uploads/2020/07/Mutton-Biryani.jpg"
        alt="Mutton Biryani"
        style={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
          This mutton biryani was absolutely killer—the meat was so tender it just melted off the bone. I could eat this stuff every single day.
        </Typography>
      </CardContent>
    </Card>
  );
}
