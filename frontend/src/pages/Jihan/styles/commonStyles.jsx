import { styled } from '@mui/material/styles';

export const Container = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  marginTop: '50px',
});

export const Form = styled('form')({
  width: '500px',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
});

export const StyledButton = styled('button')({
  marginTop: '20px',
  backgroundColor: '#3f51b5',
  color: 'white',
  '&:hover': {
    backgroundColor: '#2c387e',
  },
});

export const Input = styled('input')({
  marginBottom: '15px',
  width: '100%',
});
