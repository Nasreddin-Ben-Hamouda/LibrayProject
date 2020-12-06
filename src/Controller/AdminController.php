<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Hashids\Hashids;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{
    private $manager;
    private $hashids;
    private $filesystem;

    public function __construct(EntityManagerInterface $manager)
    {
        $this->manager=$manager;
        $this->hashids=new Hashids('',5);
        $this->filesystem=new Filesystem();
    }
    /**
     * @Route("/admin/dashboard", name="showAdminDashboard",methods={"GET"})
     */
    public function showDashboard()
    {
        return $this->render('admin/dashboard.html.twig',[]);
    }
    /**
     * @Route("/admin/profile", name="showAdminProfile",methods={"GET"})
     */
    public function showProfile()
    {
        return $this->render('admin/profile.html.twig',[]);
    }
    /**
     * @Route("/admin/students", name="showStudents",methods={"GET"})
     */
    public function showStudents()
    {
        return $this->render('admin/students.html.twig',[]);
    }
    /**
     * @Route("/admin/librarians", name="showLibrarians",methods={"GET"})
     */
    public function showLibrarians()
    {
        return $this->render('admin/librarians.html.twig',[]);
    }
}
