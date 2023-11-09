import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';

import { useAuth } from '../../../auth/context-ui';
import { PageNotFound } from '../../../navigation/ui';
import { UserDetailTemplate } from '../../ui';

const USER_DETAIL_QUERY = gql`
  query UserDetail($userName: String!) {
    user(userName: $userName) {
      ...UserDetailTemplate_user
    }
  }

  ${UserDetailTemplate.fragments.user}
`;

const QUACK_MUTATION = gql`
  mutation Quack($userId: Int!, $text: String!) {
    addQuack(userId: $userId, text: $text) {
      id
    }
  }
`;

export type UserDetailPageProps = Record<string, never>;

export function UserDetailPage(props: UserDetailPageProps) {
  const { user } = useAuth();
  const { userName } = useParams<{ userName: string }>();

  const userFetcher = useQuery(USER_DETAIL_QUERY, {
    variables: { userName },
  });

  const [quackFormText, setQuackFormText] = useState('');
  const [quackMutationRequest, quackMutationRequestState] = useMutation(
    QUACK_MUTATION,
    {
      onCompleted: () => {
        setQuackFormText('');
        userFetcher.refetch();
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onError: () => {},
    },
  );

  const quackFormState = {
    loading: quackMutationRequestState.loading,
    error: quackMutationRequestState.error,
    text: quackFormText,
    setText: setQuackFormText,
    onSubmit: ({ text }: { text: string }) => {
      quackMutationRequest({ variables: { text, userId: user?.id } });
    },
  };

  if (!userName || (userFetcher.data && userFetcher.data.user === null)) {
    return <PageNotFound />;
  }

  return (
    <UserDetailTemplate
      user={userFetcher.data?.user}
      loading={userFetcher.loading}
      error={userFetcher.error}
      onReload={() => userFetcher.refetch()}
      quackFormState={quackFormState}
      currentUser={user}
      userName={userName}
    />
  );
}
