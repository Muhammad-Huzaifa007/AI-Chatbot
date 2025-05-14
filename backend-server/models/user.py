from tortoise import fields
from tortoise.models import Model

class User(Model):
    id = fields.IntField(primary_key=True)
    user_name = fields.CharField(max_length=255)
    email = fields.CharField(max_length=255)
    password = fields.CharField(max_length=255)
    created_at = fields.DatetimeField(auto_now_add=True)
    updated_at = fields.DatetimeField(auto_now=True)

    class Meta:
        table = "users"  # custom table name
