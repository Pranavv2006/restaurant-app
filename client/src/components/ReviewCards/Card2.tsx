import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function Card2() {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            H
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Harkirat Singh"
        subheader="August 14, 2025"
      />
      <CardMedia
        component="img"
        height="194"
        image="https://aagamanrestaurant.com.au/wp-content/uploads/2023/09/amritsari-fish-fry-1292615420.jpg"
        alt="Amritsari Fish"
        style={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          What really gets me is that hit of carom seeds in the batter. its so unique and pairs perfectly with the lemon
        </Typography>
      </CardContent>
    </Card>
  );
}
