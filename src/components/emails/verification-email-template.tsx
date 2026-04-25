import { EmailTemplateProps } from '@/types';
import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from 'react-email';

export const VerificationEmailTemplate = ({ userName, url }: EmailTemplateProps) => {
  const urlImage = 'https://react.email/static/logo-without-background.png';
  const currentYear = new Date().getFullYear();
  const previewText = `Antes de começarmos, precisamos confirmar sua conta`;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-10 max-w-116.25 rounded-md border border-solid border-[#eaeaea] p-5">
            <Section className="mt-8">
              <Row>
                <Column align="center">
                  <table>
                    <tr>
                      <td>
                        <Img alt="SmartStock image" height="60" src={urlImage} />
                      </td>
                      <td>
                        <Text className="text-[28px] font-extralight text-gray-900">
                          <span className="font-semibold">Smart</span>stock
                        </Text>
                      </td>
                    </tr>
                  </table>
                </Column>
              </Row>
            </Section>
            <Heading className="mx-0 my-7.5 p-0 text-center text-[24px] font-normal text-black">
              <strong>Verificar</strong> email
            </Heading>
            <Text className="text-[14px] leading-6 text-black">
              Olá <strong>{userName}</strong>,
            </Text>
            <Text className="text-[14px] leading-6 text-black">
              Obrigado por escolher SmartStock. Para verificar seu email, clique no botão abaixo:
            </Text>
            <Section className="my-8 text-center">
              <Button
                className="rounded-md bg-blue-700 px-5 py-3 text-center text-[14px] font-semibold text-white no-underline"
                href={url}
              >
                Verificar email
              </Button>
            </Section>
            <Text className="text-[14px] leading-6 text-black">
              Ou copie e cole esta URL no seu navegador:{' '}
              <Link href={url} className="break-all text-blue-600 no-underline">
                {url}
              </Link>
            </Text>
          </Container>
          <Section className="text-center">
            <table className="w-full">
              <tr className="w-full">
                <td align="center">
                  <Img alt="SmartStock image" height="42" src={urlImage} />
                </td>
              </tr>
              <tr className="w-full">
                <td align="center">
                  <Text className="my-2 text-[16px] leading-6 font-extralight text-gray-900">
                    <span className="font-semibold">Smart</span>stock
                  </Text>
                  <Text className="mt-1 mb-0 text-[14px] leading-6 text-gray-500">
                    &copy; {currentYear} - O melhor sistema de gestão de estoque
                  </Text>
                </td>
              </tr>
            </table>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmailTemplate;
