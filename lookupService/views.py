from django.shortcuts import render
from .serializers import JobSerializer
from .models import Job
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view


# Create your views here.
def index_view(request, *args, **kwargs):
    return render(request, 'frontend/index.html', context={}, status=200)


@csrf_exempt
@api_view(['GET'])
def get_job(request, id):
    if request.method == 'GET':
        job = Job.objects.get(id__exact=id)
        serializer = JobSerializer(job)
        return JsonResponse(serializer.data)


#remember to remove exemptions
@csrf_exempt
@api_view(['POST','GET'])
def post_job(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = JobSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        jobs = Job.objects.all()
        serializer = JobSerializer(jobs, many=True)
        return JsonResponse(serializer.data, safe=False)
