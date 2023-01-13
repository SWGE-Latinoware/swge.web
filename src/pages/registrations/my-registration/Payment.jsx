import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useTranslation } from 'react-i18next';
import { CreditCard, Person, Pix } from '@mui/icons-material';
import { Divider, MenuItem, Typography } from '@mui/material';
import { isAfter } from 'date-fns';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import BoxW from '../../../components/wrapper/BoxW';
import useLocation from '../../../components/hook/useLocation';
import TextFieldW from '../../../components/wrapper/TextFieldW';
import { ReactComponent as FaCcElo } from '../../../assets/image/cc-elo.svg';
import { ReactComponent as FaCcHiperCard } from '../../../assets/image/cc-hipercard.svg';
import { ReactComponent as FaCcAmex } from '../../../assets/image/cc-amex.svg';
import { ReactComponent as FaCcMastercard } from '../../../assets/image/cc-mastercard.svg';
import { ReactComponent as FaCcVisa } from '../../../assets/image/cc-visa.svg';
import { ReactComponent as PagSeguroIcon } from '../../../assets/image/pagseguro.svg';
import { ReactComponent as PayPalIcon } from '../../../assets/image/paypal.svg';
import { ReactComponent as PagSeguroSmallIcon } from '../../../assets/image/pagseguro-icon.svg';
import CustomDialog from '../../../components/custom-dialog/CustomDialog';
import Selector from '../../../components/form-components/Selector';
import { useToast } from '../../../components/context/toast/ToastContext';
import RegistrationService from '../../../services/RegistrationService';
import TabsPanel from '../../../components/tabs-panel/TabsPanel';
import { FlexGrow, useThemeChange } from '../../../components/context/ThemeChangeContext';
import { useEditionChange } from '../../../components/context/EditionChangeContext';
import ButtonW from '../../../components/wrapper/ButtonW';
import { SimpleContentDisplay } from './ActivityCard';

const Payment = (props) => {
  const { totalPrice, products, defaultPrice, openModal, setOpenModal, regId, cancel, setPaymentStatus } = props;

  const { t } = useTranslation();
  const { formatCurrency } = useLocation();
  const { addToast } = useToast();
  const { currentTheme } = useThemeChange();
  const { currentEdition } = useEditionChange();

  const [icon, setIcon] = useState(null);
  const [installments, setInstallments] = useState(1);
  const [promotion, setPromotion] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [pixData, setPixData] = useState(null);
  const [receiverInfo, setReceiverInfo] = useState(null);

  const possibleInstallments = useMemo(
    () =>
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((value) => ({
        value,
        label: `${value} ${t('pages.myRegistration.payment.installments')} ${formatCurrency(totalPrice / value)} - ${formatCurrency(
          totalPrice
        )}`,
      })),
    [formatCurrency, t, totalPrice]
  );

  const schema = yup.object().shape({
    holder: yup.string().required(),
    number: yup
      .number()
      .required()
      .test('wrongCardNumber', '', (value) => String(value).length > 12 && String(value).length < 20),
    expMonth: yup
      .number()
      .required()
      .test('validMonth', '', (value) => value >= 1 && value <= 12)
      // eslint-disable-next-line no-use-before-define
      .test('minExpYear', '', () => validateExpireDate()),
    expYear: yup
      .number()
      .required()
      // eslint-disable-next-line no-use-before-define
      .test('minExpYear', '', () => validateExpireDate()),
    securityCode: yup
      .number()
      .required()
      .test('wrongSecurityCode', '', (value) => String(value).length >= 3 && String(value).length <= 4),
  });

  const { control, handleSubmit, formState, watch, reset } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const number = watch('number', undefined);
  const expYear = watch('expYear', undefined);
  const expMonth = watch('expMonth', undefined);

  const { errors } = formState;

  const validateExpireDate = () => {
    if (expYear && expYear?.length !== 4 && expMonth) return true;

    const cardExpDate = new Date(`${expMonth}/30/${expYear}`);

    return !isAfter(Date.now(), cardExpDate);
  };

  useEffect(() => {
    if (number) {
      const size = '80%';
      if (
        number.match(
          /^4011(78|79)|^43(1274|8935)|^45(1416|7393|763([12]))|^504175|^627780|^63(6297|6368|6369)|(65003[5-9]|65004[0-9]|65005[01])|(65040[5-9]|6504[1-3][0-9])|(65048[5-9]|65049[0-9]|6505[0-2][0-9]|65053[0-8])|(65054[1-9]|6505[5-8][0-9]|65059[0-8])|(65070[0-9]|65071[0-8])|(65072[0-7])|(65090[1-9]|6509[1-6][0-9]|65097[0-8])|(65165[2-9]|6516[67][0-9])|(65500[0-9]|65501[0-9])|(65502[1-9]|6550[34][0-9]|65505[0-8])|^(506699|5067[0-6][0-9]|50677[0-8])|^(509[0-8][0-9]{2}|5099[0-8][0-9]|50999[0-9])|^65003[1-3]|^(65003[5-9]|65004\d|65005[0-1])|^(65040[5-9]|6504[1-3]\d)|^(65048[5-9]|65049\d|6505[0-2]\d|65053[0-8])|^(65054[1-9]|6505[5-8]\d|65059[0-8])|^(65070\d|65071[0-8])|^65072[0-7]|^(65090[1-9]|65091\d|650920)|^(65165[2-9]|6516[6-7]\d)|^(65500\d|65501\d)|^(65502[1-9]|6550[3-4]\d|65505[0-8])[0-9]+$/
        )
      ) {
        // ELO
        setIcon(<FaCcElo width={size} height={size} />);
      } else if (
        number.match(/^(4).+$/) &&
        !number.match(/^((451416)|(438935)|(40117[8-9])|(45763[1-2])|(457393)|(431274)|(402934))[0-9]+$/)
      ) {
        // Visa
        setIcon(<FaCcVisa width={size} height={size} />);
      } else if (number.match(/^((34)|(37))[0-9]+$/)) {
        // Amex
        setIcon(<FaCcAmex width={size} height={size} />);
      } else if (
        number.match(/^(5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/) &&
        !number.match(
          /^(514256|514586|526461|511309|514285|501059|557909|553839|525855|553777|553771|551792|528733|549180|528745|517562|511849|557648|546367|501070|601782|508143|501085|501074|501073|501071|501068|501066|589671|589633|588729|501089|501083|501082|501081|501080|501075|501067|501062|501061|501060|501058|501057|501056|501055|501054|501053|501051|501049|501047|501045|501043|501041|501040|501039|501038|501029|501028|501027|501026|501025|501024|501023|501021|501020|501018|501016|501015|589657|589562|501105|557039|542702|544764|550073|528824|522135|522137|562397|566694|566783|568382|569322|504363)[0-9]+$/
        )
      ) {
        // Master Card
        setIcon(<FaCcMastercard width={size} height={size} />);
      } else if (number.match(/^((606282)|(637095)|(637568)|(637599)|(637609)|(637612))[0-9]+$/)) {
        // HiperCard
        setIcon(<FaCcHiperCard width={size} height={size} />);
      }
    } else {
      setIcon(null);
    }
  }, [number]);

  useEffect(() => {
    if (regId && !promotion)
      RegistrationService.getPromotion(regId).then((regResp) => {
        if (regResp.status === 200) {
          setPromotion(currentEdition.registrationType.price * (regResp.data.percentage / 100));
        }
      });
  }, [regId, promotion, defaultPrice, currentEdition.registrationType.price]);

  const handleCardDetails = (form) => {
    const cardForm = form;
    cardForm.publicKey = process.env.REACT_APP_PAGSEGURO_PUBLIC_KEY;
    const card = window.PagSeguro.encryptCard(cardForm);
    if (!card.hasErrors) {
      RegistrationService.charge(regId, { card: card.encryptedCard, installments }).then((chargeResponse) => {
        if (chargeResponse.status === 200) {
          addToast({ body: t('toastes.chargeSuccess'), type: 'success' });
          setPaymentStatus(t('pages.myRegistration.payment.paymentStatus.chargeSuccess'));
          reset({}, { keepValues: false });
          setOpenModal(false);
        } else if (chargeResponse.status >= 400 && chargeResponse.status <= 500) {
          addToast({ body: t('toastes.chargeError'), type: 'error' });
        }
      });
    } else {
      addToast({ body: t('toastes.cardError'), type: 'error' });
    }
  };

  const handleCancelCardDetails = () => {
    addToast({ body: t('toastes.paymentCancel'), type: 'warning' });

    RegistrationService.cancelPayment(regId).then((resp) => {
      if (resp.status === 200) {
        addToast({ body: t('toastes.chargeCancel'), type: 'success' });
        reset();
        setPaymentStatus(t('pages.myRegistration.payment.paymentStatus.cancelSuccess'));
        setOpenModal(false);
        cancel();
        return;
      }
      addToast({ body: t('toastes.deleteError'), type: 'error' });
    });
  };

  useEffect(() => {
    if (receiverInfo === null) {
      RegistrationService.getReceiverPix().then((resp) => {
        if (resp.status === 200) {
          setReceiverInfo(resp.data);
          addToast({ body: t('toastes.fetch'), type: 'success' });
          return;
        }
        addToast({ body: t('toastes.fetchError'), type: 'error' });
      });
    }
  }, [addToast, receiverInfo, t]);

  const handlePixDetails = useCallback(
    (form) => {
      RegistrationService.charge(regId, { ...form }).then((chargeResponse) => {
        if (chargeResponse.status === 200) {
          addToast({ body: t('toastes.chargeSuccess'), type: 'success' });
          setPaymentStatus(t('pages.myRegistration.payment.paymentStatus.chargeSuccess'));
          setPixData(chargeResponse.data);
        } else if (chargeResponse.status >= 400 && chargeResponse.status <= 500) {
          addToast({ body: t('toastes.chargeError'), type: 'error' });
        }
      });
    },
    [addToast, regId, setPaymentStatus, t]
  );

  const createPayPalOrder = () => {
    if (regId)
      return RegistrationService.createOrder(regId).then((response) => {
        if (response.status === 200) {
          return response.data;
        }
        addToast({ body: t('toastes.chargeError'), type: 'error' });
        return null;
      });
    return null;
  };

  const Summary = ({ isPagSeguro }) => (
    <>
      <BoxW
        p={2}
        width="40%"
        height="100%"
        sx={(theme) => ({ boxShadow: 5, background: theme.palette.background.paper, borderRadius: '5px' })}
      >
        <Typography variant="h6">{t('pages.myRegistration.payment.summary')}</Typography>
        <Divider />
        <BoxW marginTop="5%" marginBottom="5%" height="45%" overflow="scroll" maxHeight="45%">
          <BoxW p={0.5} display="flex" flexDirection="row" justifyContent="space-between">
            <Typography fontWeight="bold" fontSize="20">
              {t('pages.myRegistration.lecturePackCard.title')}
            </Typography>
            <Typography fontSize="15">{formatCurrency(currentEdition.registrationType.price)} </Typography>
          </BoxW>
          {products.map((product) => (
            <BoxW p={0.5} key={product.name} display="flex" flexDirection="row" justifyContent="space-between">
              <Typography fontWeight="bold" fontSize="20">
                {product.name}
              </Typography>
              <Typography fontSize="15">{formatCurrency(product.price)} </Typography>
            </BoxW>
          ))}
        </BoxW>
        <Divider />
        <BoxW p={0.5} marginTop="1%" marginBottom="1%">
          <BoxW display="flex" flexDirection="row" justifyContent="space-between">
            <Typography fontWeight="bold" fontSize="18">
              {t('pages.myRegistration.payment.subTotal')}
            </Typography>
            <Typography>{formatCurrency(promotion ? totalPrice + promotion : totalPrice)}</Typography>
          </BoxW>
          <BoxW display="flex" flexDirection="row" justifyContent="space-between">
            <Typography fontWeight="bold" fontSize="18">
              {t('pages.myRegistration.payment.promotion')}
            </Typography>
            <Typography>{formatCurrency(promotion || 0)}</Typography>
          </BoxW>
        </BoxW>
        <Divider />

        <BoxW p={0.5} marginTop="1%" marginBottom="1%">
          <BoxW display="flex" flexDirection="row" justifyContent="space-between">
            <Typography fontWeight="bold" fontSize="20">
              {t('pages.myRegistration.payment.total')}
            </Typography>
            <Typography>{formatCurrency(totalPrice)}</Typography>
          </BoxW>
        </BoxW>
        {isPagSeguro && (
          <BoxW minWidth="100px" alignItems="center" display="flex" flexDirection="row" justifyContent="center" marginTop="5%">
            <Typography sx={{ alignItems: 'center' }}>{t('pages.myRegistration.payment.pagSeguroText')}</Typography>{' '}
            <PagSeguroIcon width="45%" height="45%" />
          </BoxW>
        )}
      </BoxW>
    </>
  );

  return (
    <>
      {openModal && (
        <CustomDialog
          dialogProps={{ maxWidth: 'lg', PaperProps: { sx: { height: pixData ? '90%' : '70%' } } }}
          paymentDialog
          open={openModal}
          onClose={() => {
            reset();
            setOpenModal(false);
            cancel();
          }}
          buttonOnClick={
            (activeTab === 1 && handleSubmit(handleCardDetails)) ||
            (activeTab === 2 &&
              (() => {
                reset();
                setOpenModal(false);
              }))
          }
          buttonErrorOnClick={() => activeTab !== 0 && handleCancelCardDetails()}
          buttonText={(activeTab === 1 || (activeTab === 2 && pixData !== null)) && t('pages.myRegistration.payment.confirmPayment')}
          buttonErrorText={activeTab !== 0 && t('pages.myRegistration.payment.cancelPayment')}
          title={t('pages.myRegistration.payment.title')}
          content={
            <TabsPanel
              primary
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={[
                {
                  label: t('pages.myRegistration.payment.paypal'),
                  enabled: true,
                  icon: (
                    <PayPalIcon
                      width="30px"
                      height="30px"
                      fill={currentTheme.palette.getContrastText(currentTheme.palette.background.paper)}
                    />
                  ),
                },
                {
                  label: t('pages.myRegistration.payment.pagseguro'),
                  enabled: true,
                  icon: (
                    <PagSeguroSmallIcon
                      width="30px"
                      height="30px"
                      fill={currentTheme.palette.getContrastText(currentTheme.palette.background.paper)}
                    />
                  ),
                },
                {
                  label: t('pages.myRegistration.payment.pix'),
                  enabled: true,
                  icon: <Pix />,
                },
              ]}
              panels={[
                <BoxW
                  p={1}
                  width="100%"
                  height="100%"
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  sx={(theme) => ({
                    background: theme.palette.mode === 'dark' && theme.palette.getContrastText(theme.palette.background.paper),
                    borderRadius: '5px',
                  })}
                >
                  <BoxW
                    p={1}
                    minWidth="500px"
                    width="53%"
                    height="100%"
                    display="flex"
                    flexDirection="column"
                    alignContent="center"
                    paddingLeft={2}
                  >
                    <PayPalScriptProvider
                      options={{
                        'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID,
                        components: 'buttons',
                        currency: 'BRL',
                      }}
                    >
                      <BoxW minWidth="50%" border="1px" paddingTop={2}>
                        {regId && (
                          <PayPalButtons
                            style={{ color: 'gold', shape: 'pill', height: 55 }}
                            disabled={false}
                            fundingSource={undefined}
                            createOrder={() => createPayPalOrder()}
                            onApprove={(data, actions) =>
                              actions.order.capture().then((algo) => {
                                RegistrationService.saveOrder(regId, algo).then((resp) => {
                                  if (resp.status === 200) {
                                    reset();
                                    setPaymentStatus(t('pages.myRegistration.payment.paymentStatus.chargeSuccess'));
                                    setOpenModal(false);
                                  }
                                });
                              })
                            }
                          />
                        )}
                      </BoxW>
                    </PayPalScriptProvider>
                  </BoxW>
                  <Summary />
                </BoxW>,
                <BoxW p={1} width="100%" display="flex" flexDirection="row" justifyContent="space-between">
                  <BoxW
                    p={2}
                    width="55%"
                    display="flex"
                    flexDirection="column"
                    sx={(theme) => ({ boxShadow: 5, background: theme.palette.background.paper, borderRadius: '5px' })}
                  >
                    <BoxW paddingLeft={1}>
                      <Typography variant="h6">{t('pages.myRegistration.payment.cardDetails')}</Typography>
                    </BoxW>
                    <BoxW p={1}>
                      <Controller
                        name="holder"
                        render={({ field }) => (
                          <TextFieldW
                            label={t('pages.myRegistration.payment.holder')}
                            {...field}
                            prefix={<Person />}
                            error={errors?.holder}
                            required
                          />
                        )}
                        control={control}
                      />
                    </BoxW>
                    <BoxW p={1} display="flex" flexDirection="row">
                      <Controller
                        name="number"
                        render={({ field }) => (
                          <>
                            <BoxW width="100%">
                              <TextFieldW
                                label={t('pages.myRegistration.payment.number')}
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                {...field}
                                prefix={<CreditCard />}
                                error={errors?.number}
                                required
                              />
                            </BoxW>
                            {icon && (
                              <BoxW minWidth="50px" width="15%" alignItems="center" justifyContent="center" display="flex" marginLeft="1px">
                                {icon}
                              </BoxW>
                            )}
                          </>
                        )}
                        control={control}
                      />
                    </BoxW>
                    <BoxW width="100%" display="flex" flexDirection="row" justifyContent="space-between">
                      <BoxW p={1} minWidth="75px" width="60%">
                        <BoxW>
                          <Typography>{t('pages.myRegistration.payment.expires')}</Typography>
                        </BoxW>
                        <BoxW minWidth="75px" display="flex" flexDirection="row" paddingTop="5px">
                          <BoxW minWidth="75px" width="25%">
                            <Controller
                              name="expMonth"
                              render={({ field }) => (
                                <TextFieldW
                                  label={t('pages.myRegistration.payment.expMonth')}
                                  {...field}
                                  error={errors?.expMonth}
                                  placeholder="MM"
                                  required
                                />
                              )}
                              control={control}
                            />
                          </BoxW>
                          <BoxW minWidth="75px" width="35%" marginLeft="5%">
                            <Controller
                              name="expYear"
                              render={({ field }) => (
                                <TextFieldW
                                  label={t('pages.myRegistration.payment.expYear')}
                                  {...field}
                                  error={errors?.expYear}
                                  placeholder="AAAA"
                                  required
                                />
                              )}
                              control={control}
                            />
                          </BoxW>
                        </BoxW>
                      </BoxW>
                      <BoxW p={1} width="30%" minWidth="200px" flexWrap="wrap">
                        <BoxW>
                          <Typography>{t('pages.myRegistration.payment.securityCode')}</Typography>
                        </BoxW>
                        <BoxW display="flex" flexDirection="row" paddingTop="5px" minWidth="75px">
                          <Controller
                            name="securityCode"
                            render={({ field }) => (
                              <TextFieldW
                                label={t('pages.myRegistration.payment.cvv')}
                                {...field}
                                error={errors?.securityCode}
                                placeholder="000"
                                required
                              />
                            )}
                            control={control}
                          />
                        </BoxW>
                      </BoxW>
                    </BoxW>
                    <BoxW p={1}>
                      <Selector
                        label={t('pages.myRegistration.payment.possibleInstallment')}
                        required
                        value={installments}
                        onChange={(e) => setInstallments(e.target.value)}
                      >
                        {possibleInstallments.map((item) => (
                          <MenuItem key={item.key} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </Selector>
                    </BoxW>
                  </BoxW>
                  <Summary isPagSeguro />
                </BoxW>,
                <BoxW
                  p={1}
                  width="100%"
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  pb={0}
                  sx={(theme) => ({ backgroundColor: theme.palette.background.default })}
                >
                  <BoxW p={1} width="55%" display="flex" flexDirection="column" pt={0} pb={0}>
                    <BoxW p={2} sx={(theme) => ({ boxShadow: 5, background: theme.palette.background.paper, borderRadius: '5px' })}>
                      <BoxW paddingLeft={1}>
                        <Typography variant="h6">{t('pages.myRegistration.payment.pixDetails')}</Typography>
                      </BoxW>
                      <BoxW p={1}>
                        {receiverInfo && (
                          <>
                            <SimpleContentDisplay
                              leftItem={t('pages.myRegistration.payment.receiver.name')}
                              rightItem={receiverInfo.name}
                            />
                            <SimpleContentDisplay leftItem={t('pages.myRegistration.payment.receiver.key')} rightItem={receiverInfo.key} />
                          </>
                        )}
                      </BoxW>
                      {pixData ? (
                        <BoxW p={1} width="100%" display="flex" flexDirection="column" justifyContent="center" alignItens="center">
                          <BoxW width="100%" flexDirection="column" justifyContent="center" alignItens="center">
                            <Typography fontWeight="bold">{t('pages.myRegistration.payment.pixCopyText')}</Typography>
                            <Typography fontSize={12}>{pixData.pixCopiaECola}</Typography>
                          </BoxW>

                          <BoxW
                            pt={1}
                            width="100%"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItens="center"
                            pb={0}
                          >
                            <Typography fontWeight="bold">{t('pages.myRegistration.payment.pixQrCode')}</Typography>
                            <img
                              src={pixData.urlImagemQrCode}
                              width="300px"
                              height="300px"
                              alt="QrCode"
                              style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '8px' }}
                            />
                          </BoxW>
                        </BoxW>
                      ) : (
                        <BoxW display="flex" flexDirection="row" width="100%" justifyContent="space-between">
                          <BoxW p={1} width="60%">
                            <FlexGrow />
                          </BoxW>
                          <BoxW p={1} minWidth="300px" width="40%" display="flex" justifyContent="center" pl={0}>
                            <ButtonW autoFocus primary onClick={handlePixDetails}>
                              {t('pages.myRegistration.payment.sendPix')}
                            </ButtonW>
                          </BoxW>
                        </BoxW>
                      )}
                    </BoxW>
                  </BoxW>
                  <Summary isPagSeguro />
                </BoxW>,
              ]}
            />
          }
        />
      )}
    </>
  );
};

export default Payment;
