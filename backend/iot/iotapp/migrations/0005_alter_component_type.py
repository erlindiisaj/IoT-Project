# Generated by Django 5.2.1 on 2025-05-17 23:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('iotapp', '0004_alter_component_pin_alter_component_room_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='component',
            name='type',
            field=models.CharField(choices=[('led', 'led'), ('motor', 'motor'), ('dht', 'dht'), ('ldr', 'ldr'), ('pir', 'pir')], max_length=50),
        ),
    ]
