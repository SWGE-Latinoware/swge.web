import React, { forwardRef } from 'react';
import { Dialog, DialogActions, DialogContent, IconButton, Slide, Typography } from '@mui/material';
import MuiDialogTitle from '@mui/material/DialogTitle';
import { Close as CloseIcon } from '@mui/icons-material';
import ButtonW from '../wrapper/ButtonW';
import { useThemeChange } from '../context/ThemeChangeContext';

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props}>
    {props.children}
  </Slide>
));

const CustomDialog = (props) => {
  const {
    open,
    onClose,
    title,
    content,
    buttonText,
    buttonOnClick,
    buttonErrorText,
    buttonErrorOnClick,
    dialogProps,
    buttonOtherActionText,
    buttonOtherActionOnClick,
    paymentDialog,
    disableEscapeKeyDown,
  } = props;

  const { currentTheme } = useThemeChange();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      fullWidth
      {...dialogProps}
      disableEscapeKeyDown={disableEscapeKeyDown}
      scroll={window.chrome ? 'body' : 'paper'}
    >
      <MuiDialogTitle
        disableTypography
        sx={(theme) => ({
          margin: 0,
          padding: (!paymentDialog && 2) || (paymentDialog && 2.5),
          backgroundColor: paymentDialog && theme.palette.appBar.backgroundColor,
        })}
      >
        <Typography
          sx={{ paddingLeft: '8px', width: '90%' }}
          variant="h6"
          color={paymentDialog && currentTheme.palette.getContrastText(currentTheme.palette.appBar.backgroundColor)}
        >
          {title}
        </Typography>
        {onClose && (
          <IconButton
            aria-label="close"
            sx={(theme) => ({
              position: 'absolute',
              right: theme.spacing(1),
              top: theme.spacing(1),
              color:
                (!paymentDialog && theme.palette.text.primary) ||
                (paymentDialog && currentTheme.palette.getContrastText(currentTheme.palette.appBar.backgroundColor)),
            })}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        )}
      </MuiDialogTitle>
      <DialogContent
        sx={(theme) => ({
          padding: !paymentDialog && 2,
          backgroundColor: paymentDialog && theme.palette.background.default,
          paddingBottom: paymentDialog && 0,
        })}
      >
        {content}
      </DialogContent>
      <DialogActions sx={(theme) => ({ backgroundColor: paymentDialog && theme.palette.background.default })}>
        {buttonErrorText && (
          <ButtonW
            autoFocus
            onClick={buttonErrorOnClick || onClose}
            error={!buttonOtherActionText}
            color={buttonOtherActionText && 'warning'}
            variant={(buttonOtherActionText && 'outlined') || (paymentDialog && 'contained')}
          >
            {buttonErrorText}
          </ButtonW>
        )}
        {buttonOtherActionText && (
          <ButtonW autoFocus onClick={buttonOtherActionOnClick || onClose} error>
            {buttonOtherActionText}
          </ButtonW>
        )}
        {buttonText && (
          <ButtonW autoFocus onClick={buttonOnClick || onClose} primary>
            {buttonText}
          </ButtonW>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
