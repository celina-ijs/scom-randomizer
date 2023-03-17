import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

Styles.cssRule('#pnlRandomizerMain', {
  margin: '0 auto',
  maxWidth: '1400px',
  border: '3px solid rgba(189, 189, 189, 0.4)',
  $nest: {
    '.random-number': {
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(180deg, #FFEAA4 0%, #CB9B00 100%)',
      fontFamily: Theme.typography.fontFamily,
      $nest: {
        '> span': {
          display: 'contents'
        }
      }
    },
    '.no-wrap': {
      whiteSpace: 'nowrap'
    }
  }
});
