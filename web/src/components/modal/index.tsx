import React from 'react'
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  type DialogProps,
} from '@mui/material'
import { X } from 'lucide-react'

interface Props extends DialogProps {
  onClose?: VoidFunction
  onSave?: () => void
  children?: React.ReactNode
  title: string
  loading?: boolean
  titleSaveButton?: string
  titleCloseButton?: string
  colorSaveButton?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  colorCloseButton?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
  showSaveButton?: boolean
  disabled?: boolean
  loadingLabel?: string
}

export default function CustomModal({
  onClose,
  onSave,
  children,
  title,
  loading,
  titleSaveButton = '',
  titleCloseButton = '',
  colorSaveButton = 'inherit',
  colorCloseButton = 'inherit',
  showSaveButton = true,
  disabled,
  loadingLabel = 'Guardando...',
  ...other
}: Props) {
  return (
    <Dialog onClose={onClose} {...other} disableRestoreFocus>
      <DialogTitle sx={{ mt: 2 }}>{title}</DialogTitle>
      <IconButton
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
        onClick={onClose}
      >
        <X size={16} />
      </IconButton>
      <DialogContent sx={{ overflow: 'unset', mt: 2 }}>{children}</DialogContent>
      <DialogActions sx={{ zIndex: 2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            width: '100%',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            variant="contained"
            onClick={onClose}
            color={colorCloseButton}
            disabled={loading}
            sx={{
              width: '120px',
              textTransform: 'none',
            }}
            fullWidth
          >
            {titleCloseButton}
          </Button>
          {showSaveButton && (
            <Button
              variant="contained"
              type="submit"
              color={colorSaveButton}
              disabled={loading || disabled}
              onClick={onSave}
              sx={{
                width: '120px',
                textTransform: 'none',
              }}
              fullWidth
            >
              {loading ? loadingLabel : titleSaveButton}
            </Button>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  )
}
