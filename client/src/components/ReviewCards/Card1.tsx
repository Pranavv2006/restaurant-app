import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function Card1() {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: blue[500] }} aria-label="recipe">
            S
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Siddharth Chaudhary"
        subheader="September 25, 2025"
      />
      <CardMedia
        component="img"
        height="194"
        image="https://4.bp.blogspot.com/-9KBEX1P7_vU/UOqyYoP3XgI/AAAAAAAAGkw/VxhHOm3H3cY/s1600/Mutton+Biryani.01.jpg"
        alt="Mutton Biryani"
        style={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          This mutton biryani was absolutely killer—the meat was so tender it just melted off the bone. I could eat this stuff every single day.
        </Typography>
      </CardContent>
    </Card>
  );
}
