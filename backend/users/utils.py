from django.contrib.auth.tokens import PasswordResetTokenGenerator
import six
class TokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self,user,timestamp):
        hash_value = (six.text_type(user.pk) + six.text_type(timestamp) + six.text_type(user.is_active))
        print(f"Generating token hash for user {user.pk}: {hash_value}")  # Debug
        return hash_value

    def check_token(self, user, token):
        is_valid = super().check_token(user, token)
        print(f"Checking token for user {user.pk}: {'Valid' if is_valid else 'Invalid'}")  # Debug
        return is_valid
    
generate_token=TokenGenerator()