import { Heading, Link, MainSection } from '@quacker/ui';
import { route } from '@quacker/utils';

import { SignUpForm } from '../organisms/';
import type { SignUpFormProps } from '../organisms/';
import { TopNavigation } from '../../../navigation/ui';

export type SignUpTemplateProps = {
  isLoading?: boolean;
  error?: Error | null;
  onSubmit: SignUpFormProps['onSubmit'];
};

export function SignUpTemplate({
  isLoading,
  error,
  onSubmit,
}: SignUpTemplateProps) {
  return (
    <>
      <TopNavigation />
      <MainSection>
        <Heading>Sign Up</Heading>

        <SignUpForm
          isLoading={isLoading}
          errorMessage={error && error.message}
          onSubmit={onSubmit}
          className="mt3"
        >
          <div className="lh-copy">
            or{' '}
            <Link className="f5 dark-green" to={route.signIn()}>
              Sign In
            </Link>
          </div>
        </SignUpForm>
      </MainSection>
    </>
  );
}
