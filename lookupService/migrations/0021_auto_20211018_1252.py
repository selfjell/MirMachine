# Generated by Django 3.2.6 on 2021-10-18 12:52

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('lookupService', '0020_auto_20211007_1344'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='submitted',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='job',
            name='initiated',
            field=models.DateTimeField(blank=True),
        ),
    ]
