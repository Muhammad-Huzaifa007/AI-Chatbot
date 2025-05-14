from tortoise import fields
from tortoise.models import Model
from models.user import User

class Conversation(Model):
    id = fields.IntField(pk=True)
    user: fields.ForeignKeyRelation[User] = fields.ForeignKeyField(
        "models.User", related_name="conversations", on_delete=fields.CASCADE
    )
    title = fields.CharField(max_length=255, null=True)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "conversations"
