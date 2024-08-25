import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';
const StyledItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
}));

export default StyledItem;
