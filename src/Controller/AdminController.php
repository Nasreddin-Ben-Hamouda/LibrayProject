<?php

namespace App\Controller;

use App\Entity\Book;
use App\Entity\Loan;
use App\Entity\User;
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
        $countOfStudent=count($this->manager->getRepository(User::class)->findUsersByRole('ROLE_STUDENT'));
        $countOfLibrarian=count($this->manager->getRepository(User::class)->findUsersByRole('ROLE_STUDENT'));
        $mostFiveBooks=$this->manager->getRepository(Book::class)->mostFiveBooks();
        $mostFiveStudent=$this->manager->getRepository(User::class)->mostFiveStudents();


        return $this->render('admin/dashboard.html.twig',
            [
                'countOfStudent'=>$countOfStudent,
                'countOfLibrarian'=>$countOfLibrarian,
                'mostFiveBooks'=>$mostFiveBooks,
                'mostFiveStudent'=>$mostFiveStudent
            ]);
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
        $students=$this->manager->getRepository(User::class)->findUsersByRole('ROLE_STUDENT');
        return $this->render('admin/students.html.twig',['students'=>$students]);
    }
    /**
     * @Route("/admin/librarians", name="showLibrarians",methods={"GET"})
     */
    public function showLibrarians()
    {
        $librarians=$this->manager->getRepository(User::class)->findUsersByRole('ROLE_LIBRARIAN');
        return $this->render('admin/librarians.html.twig',['librarians'=>$librarians]);
    }
    /**
     * @Route("/admin/students/{id}/{role}/delete", name="handleDeleteUser",methods={"GET"})
     */
    public function handleDeleteUser($id,$role){
        $user=$this->manager->getRepository(User::class)->find($this->hashids->decodeHex($id));
        if($user){
            if($user->getPhoto()){
                $this->filesystem->remove($this->getParameter('storage').'/images/avatar/'.$user->getPhoto());
            }
            $this->manager->remove($user);
            $this->manager->flush();
            $this->addFlash('success','Etudiant supprimé avec succès');
        }else{
            $this->addFlash('error','Etudiant inexistant');
        }
        if($role=="librarian")
            return $this->redirectToRoute('showLibrarians');
        else
            return $this->redirectToRoute('showStudents');
    }
}
