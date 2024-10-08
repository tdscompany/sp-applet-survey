import { InputField } from "@/components/hook-form-fields";
import { TextAreaField } from "@/components/text-area";
import { useMutateComment } from "@/hooks/use-mutate-comment";
import { Button, Container, Heading, useToast, VStack } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { InferType, object, string } from "yup";

const schema = object({
  answer: string().required("Campo obrigatório"),
  name: string().optional(),
  email: string().optional(),
  phone: string().optional(),
  age: string().optional(),
  gender: string().optional(),
});

type SchemaType = InferType<typeof schema>;

const Survey = () => {
  const router = useRouter();
  const divergencePointId = router.query.point_id as string;
  const questionId = router.query.question_id as string;

  const methods = useForm<SchemaType>({
    resolver: yupResolver(schema),
  });

  const mutateComment = useMutateComment();

  const toast = useToast();

  const onSubmit: SubmitHandler<SchemaType> = async (data) => {
    try {
      const name = data.name ? `Nome: ${data.name}` : "";
      const email = data.email ? `E-mail: ${data.email}` : "";
      const phone = data.phone ? `Telefone: ${data.phone}` : "";
      const age = data.age ? `Idade: ${data.age}` : "";
      const answer = `Resposta: ${data.answer}`;

      const text = [name, email, phone, age, answer].join("\n");

      await mutateComment.mutateAsync({
        text: text,
        divergencePointId,
        questionId,
      });

      // make all the fields empty
      methods.setValue("name", "");
      methods.setValue("email", "");
      methods.setValue("phone", "");
      methods.setValue("age", "");
      methods.setValue("gender", "");
      methods.setValue("answer", "");

      toast({
        title: "Resposta enviada com sucesso!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar resposta",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container py={10}>
      <VStack spacing={4} align={"left"} w="full">
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <VStack spacing={4} align={"left"} w={"full"}>
            <FormProvider {...methods}>
              <InputField
                fieldName="name"
                label="Nome"
                placeholder="Preencha o nome da pessoa"
              />

              <InputField
                fieldName="email"
                label="E-mail"
                placeholder="Preencha o e-mail"
              />

              <InputField
                fieldName="phone"
                label="Telefone"
                placeholder="Preencha o telefone"
              />

              <InputField
                fieldName="age"
                label="Idade"
                placeholder="Preencha a idade"
              />

              <InputField
                fieldName="gender"
                label="Gênero"
                placeholder="Preencha o gênero"
              />

              <TextAreaField
                fieldName="answer"
                label="Resposta"
                placeholder={"Preencha a resposta"}
                isRequired
              />

              <Button
                type="submit"
                colorScheme="pink"
                isDisabled={
                  mutateComment.isPending || !methods.formState.isValid
                }
                isLoading={mutateComment.isPending}
              >
                Enviar
              </Button>
            </FormProvider>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};

export default Survey;
