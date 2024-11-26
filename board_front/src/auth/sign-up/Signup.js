import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme';
import { GoogleIcon, FacebookIcon, SitemarkIcon } from './CustomIcons';
import ColorModeSelect from '../../shared-theme/ColorModeSelect';
import ConfirmDialog from './Confirm';
import { useDialog } from './useDialog';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

export default function SignUp(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [phoneError , setPhoneError] = React.useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = React.useState('');
  const [addr1Error, setAddr1Error] = React.useState(false);
  const [addr1ErrorMessage, setAddr1ErrorMessage] = React.useState('');
  const [addr2Error, setAddr2Error] = React.useState(false);
  const [addr2ErrorMessage, setAddr2ErrorMessage] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [addr1ReadOnly, setAddr1ReadOnly] = React.useState(false);

  const { isOpen, openDialog, handleConfirm, handleCancel } = useDialog();
  const navigate = useNavigate();

  //다음지도 API불러오기
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  //주소검색
  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setAddress(data.address);
        setAddr1ReadOnly(true);
      },
    }).open();
  };

  //각 항목 작성했는지 검증
  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const addr2 = document.getElementById('addr2');
    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('이메일 형식이 올바르지 않습니다.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('비밀번호는 6자 이상으로 설정하세요');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name.value || name.length < 1) {
      setNameError(true);
      setNameErrorMessage('이름을 입력해주세요');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }    

    if (!phone.value || phone.value.length < 1) {
      setPhoneError(true);
      setPhoneErrorMessage('전화번호를 입력해주세요');
      isValid = false;
    } else {
      setPhoneError(false);
      setPhoneErrorMessage('');
    }

    if (!address || address.length < 1) {
      setAddr1Error(true);
      setAddr1ErrorMessage('주소를 입력해주세요');
      isValid = false;
    } else {
      setAddr1Error(false);
      setAddr1ErrorMessage('');
    }

    if (!addr2.value || addr2.value.length < 1) {
      setAddr2Error(true);
      setAddr2ErrorMessage('상세주소를 입력해주세요');
      isValid = false;
    } else {
      setAddr2Error(false);
      setAddr2ErrorMessage('');
    }

    return isValid;
  };

  //이메일 중복체크 요청 보내기
  const handleEmailCheck = async (email) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/auth/emailDuplicated`, 
        {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
         }
      );
  
      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Network error:', error);
      return false;
    }
    
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (emailError || passwordError || nameError || phoneError || addr1Error || addr2Error) {
      return;
    }

    const data = new FormData(event.currentTarget);

    //이메일 중복체크
    const isUniqueEmail = await handleEmailCheck(data.get('email'));

    if(isUniqueEmail){
        //confirm창 응답 받기
        const confirm = await openDialog();

        if(confirm){

            const email = data.get("email");
            const password = data.get("password");
            const name = data.get("name");
            const phone = data.get("phone");
            const addr1 = data.get("addr1");
            const addr2 = data.get("addr2");
            //회원가입 진행
            try {
                const response = await fetch(
                  `${process.env.REACT_APP_SERVER_URL}/api/auth/signinUser`, 
                  {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ email, password, name, phone, addr1, addr2 }),
                  }
                );
            
                if (response.ok) {
                    alert('회원가입이 성공적으로 완료되었습니다.');
                    navigate('/');
                } else if(response.status===401){
                  alert('회원가입에 실패했습니다. 이미 존재하는 이메일입니다.');
                  setEmailError(true);
                  setEmailErrorMessage('중복된 이메일입니다.');
                }else{
                    // 기타 서버 오류 처리
                    alert('회원가입에 실패했습니다. 잠시후 다시 시도해주세요.');
                }
              } catch (error) {
                console.error('Network error:', error);
                alert('네트워크 오류가 발생했습니다. 잠시후 다시 시도해주세요.');
              }

        }
        
    }else{
        setEmailError(true);
        setEmailErrorMessage('중복된 이메일 입니다.');
        return;
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined"
            sx={{
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                display: 'none', // 스크롤바 숨기기
                },
                '-ms-overflow-style': 'none', // IE 및 Edge에서 스크롤바 숨기기
                'scrollbar-width': 'none', // Firefox에서 스크롤바 숨기기
            }}>
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            회원가입
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <FormControl>
              <FormLabel htmlFor="email">이메일</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">비밀번호</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="최소6자이상 설정해주세요"
                type="password"
                id="password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="name">이름</FormLabel>
              <TextField
                name="name"
                required
                fullWidth
                id="name"
                placeholder="김철수"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="phone">전화번호</FormLabel>
              <TextField
                name="phone"
                required
                fullWidth
                id="phone"
                placeholder="010-1234-5678"
                error={phoneError}
                helperText={phoneErrorMessage}
                color={phoneError ? 'error' : 'primary'}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="addr1">주소</FormLabel>
              <TextField
                name="addr1"
                required
                fullWidth
                id="addr1"
                placeholder="주소검색하기"
                value={address}
                slotProps={{
                    input: { readOnly: addr1ReadOnly },
                }}
                error={addr1Error}
                helperText={addr1ErrorMessage}
                color={addr1Error ? 'error' : 'primary'}
                onClick={handleAddressSearch}
              />
            </FormControl>
            <FormControl>
              <TextField
                name="addr2"
                required
                fullWidth
                id="addr2"
                placeholder="상세주소"
                error={addr2Error}
                helperText={addr2ErrorMessage}
                color={addr2Error ? 'error' : 'primary'}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              회원가입
            </Button>
            <ConfirmDialog
                open={isOpen}
                title="입력하신 내용으로 가입하시겠어요?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
            <Typography sx={{ textAlign: 'center' }}>
              이미 계정이 있으신가요?   {' '}
              <span>
                <Link
                  component={RouterLink}
                  to='/login'
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                >
                  로그인
                </Link>
              </span>
            </Typography>
          </Box>
          <Divider>
            <Typography sx={{ color: 'text.secondary' }}>or</Typography>
          </Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Google')}
              startIcon={<GoogleIcon />}
            >
              구글아이디로 회원가입
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign up with Facebook')}
              startIcon={<FacebookIcon />}
            >
              페이스북으로 회원가입
            </Button>
          </Box>
        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
