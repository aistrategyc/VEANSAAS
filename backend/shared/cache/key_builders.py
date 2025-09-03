def user_me_key_builder(*args, **kwargs) -> str | None:
    current_user = kwargs.get('current_user')
    if current_user and current_user.get('user_uuid'):
        return f'user_me:{current_user["user_uuid"]}'
    return None
