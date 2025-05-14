from tortoise import fields
from tortoise.models import Model
from models.user import User  # import the User model

from models.conversation import Conversation  # import your conversation model

class Prompt(Model):
    id = fields.IntField(pk=True)
    prompt = fields.CharField(max_length=1255)
    response = fields.TextField(null=True)
    user: fields.ForeignKeyRelation[User] = fields.ForeignKeyField(
        "models.User", related_name="prompts", on_delete=fields.CASCADE
    )
    conversation: fields.ForeignKeyRelation[Conversation] = fields.ForeignKeyField(
        "models.Conversation", related_name="prompts", on_delete=fields.CASCADE
    )
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "prompts"


