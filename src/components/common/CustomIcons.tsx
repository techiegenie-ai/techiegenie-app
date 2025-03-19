import { GenIcon, IconBaseProps } from 'react-icons';

export function HiShieldX(props: IconBaseProps) {
  return GenIcon({
    tag: 'svg',
    attr: {
      viewBox: '0 0 20 20',
      fill: 'currentColor',
      'aria-hidden': 'true',
    },
    child: [
      {
        tag: 'path',
        attr: {
          fillRule: 'evenodd',
          d: 'M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
          clipRule: 'evenodd',
        },
        child: [],
      },
    ],
  })(props);
}

export function HiShieldMinus(props: IconBaseProps) {
  return GenIcon({
    tag: 'svg',
    attr: {
      viewBox: '0 0 20 20',
      fill: 'currentColor',
      'aria-hidden': 'true',
    },
    child: [
      {
        tag: 'path',
        attr: {
          fillRule: 'evenodd',
          d: 'M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z', // Shield with Minus
          clipRule: 'evenodd',
        },
        child: [],
      },
    ],
  })(props);
}

export function GoogleIcon(props: IconBaseProps) {
  return GenIcon({
    tag: 'svg',
    attr: {
      viewBox: '0 0 24 24',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
    },
    child: [
      {
        tag: 'path',
        attr: {
          d: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z',
          fill: '#4285F4',
        },
        child: [],
      },
      {
        tag: 'path',
        attr: {
          d: 'M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z',
          fill: '#34A853',
        },
        child: [],
      },
      {
        tag: 'path',
        attr: {
          d: 'M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z',
          fill: '#FBBC05',
        },
        child: [],
      },
      {
        tag: 'path',
        attr: {
          d: 'M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z',
          fill: '#EA4335',
        },
        child: [],
      },
      {
        tag: 'path',
        attr: {
          d: 'M1 1h22v22H1z',
          fill: 'none',
        },
        child: [],
      },
    ],
  })(props);
}
