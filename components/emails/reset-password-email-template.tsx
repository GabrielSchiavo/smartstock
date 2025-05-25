import { EmailTemplateProps } from "@/types";
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
} from "@react-email/components";

export const ResetPasswordEmailTemplate = ({
  userName,
  url,
}: EmailTemplateProps) => {
  const urlImage = "https://react.email/static/logo-without-background.png";
  const currentYear = new Date().getFullYear();
  const previewText = `Recebemos uma solicitação para redefinir sua senha`;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-md border border-[#eaeaea] border-solid p-[20px]">
            <Section className=" mt-[32px]">
              <Row>
                <Column align="center">
                  <table>
                    <tr>
                      <td>
                        <Img
                          alt="Smartstock image"
                          height="60"
                          src={urlImage}
                        />
                      </td>
                      <td>
                        <Text className="font-extralight text-[28px] text-gray-900">
                          <span className="font-semibold">Smart</span>stock
                        </Text>
                      </td>
                    </tr>
                  </table>
                </Column>
              </Row>
            </Section>
            <Heading className="mx-0 my-[30px] p-0 text-center font-normal text-[24px] text-black">
              <strong>Redefinir</strong> sua senha
            </Heading>
            <Text className="text-[14px] text-black leading-[24px]">
              Olá <strong>{userName}</strong>,
            </Text>
            <Text className="text-[14px] text-black leading-[24px]">
              Clique no botão abaixo para redefinir a senha do seu usuário:
            </Text>
            <Section className="mt-[32px] mb-[32px] text-center">
              <Button
                className="rounded-md bg-blue-700 px-5 py-3 text-center font-semibold text-[14px] text-white no-underline"
                href={url}
              >
                Redefinir senha
              </Button>
            </Section>
            <Text className="text-[14px] text-black leading-[24px]">
              Ou copie e cole esta URL no seu navegador:{" "}
              <Link href={url} className="text-blue-600 no-underline">
                {url}
              </Link>
            </Text>
          </Container>
          <Section className="text-center">
            <table className="w-full">
              <tr className="w-full">
                <td align="center">
                  <Img
                    alt="Smartstock image"
                    height="42"
                    src={urlImage}
                  />
                </td>
              </tr>
              <tr className="w-full">
                <td align="center">
                  <Text className="font-extralight my-[8px] text-[16px] text-gray-900 leading-[24px]">
                    <span className="font-semibold">Smart</span>stock
                  </Text>
                  <Text className="mt-[4px] mb-0 text-[14px] text-gray-500 leading-[24px]">
                    &copy; {currentYear} - O melhor serviço de gestão de estoque
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

export default ResetPasswordEmailTemplate;
